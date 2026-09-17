import { describe, it, expect, vi, beforeEach } from "vitest";

// ── Mock firebase/firestore ────────────────────────────────────────────────
const mockGetDocs = vi.fn();
const mockGetDoc = vi.fn();
const mockSetDoc = vi.fn();
const mockUpdateDoc = vi.fn();
const mockServerTimestamp = vi.fn(() => "__SERVER_TS__");
const mockDoc = vi.fn((_db, col, id) => ({ _col: col, _id: id }));
const mockCollection = vi.fn((_db, col) => ({ _col: col }));
const mockQuery = vi.fn((...args) => ({ _args: args }));
const mockWhere = vi.fn((field, op, val) => ({ field, op, val }));

vi.mock("firebase/firestore", () => ({
  query: (...args) => mockQuery(...args),
  collection: (...args) => mockCollection(...args),
  where: (...args) => mockWhere(...args),
  getDocs: (...args) => mockGetDocs(...args),
  getDoc: (...args) => mockGetDoc(...args),
  setDoc: (...args) => mockSetDoc(...args),
  updateDoc: (...args) => mockUpdateDoc(...args),
  doc: (...args) => mockDoc(...args),
  serverTimestamp: () => mockServerTimestamp(),
}));

vi.mock("../../firebase_config", () => ({ db: {} }));

// ── Import SUT after mocks ─────────────────────────────────────────────────
import {
  generateGuestId,
  lookupGuest,
  lookupExistingRsvps,
  saveRsvps,
  updateGuestPartyMembers,
  updateGuestMemberName,
  lookupNamesByGuestIds,
  upsertGuestForMember,
  notifyGoogleSheets,
} from "../rsvp";

// ── Helpers ────────────────────────────────────────────────────────────────

function makeSnap(docs = []) {
  return { empty: docs.length === 0, docs, forEach: (fn) => docs.forEach(fn) };
}

function makeDocSnap(data) {
  return { exists: () => true, data: () => data };
}

function missingDocSnap() {
  return { exists: () => false };
}

// ── generateGuestId ────────────────────────────────────────────────────────

describe("generateGuestId", () => {
  it("returns a string of the form `{slug}-{8digits}`", async () => {
    const id = await generateGuestId("John", "Smith");
    expect(id).toMatch(/^johnsmith-\d{8}$/);
  });

  it("is deterministic for the same inputs", async () => {
    const a = await generateGuestId("Jane", "Doe");
    const b = await generateGuestId("Jane", "Doe");
    expect(a).toBe(b);
  });

  it("differs when parentGuestId changes", async () => {
    const a = await generateGuestId("Jane", "Doe", "parent-1");
    const b = await generateGuestId("Jane", "Doe", "parent-2");
    expect(a).not.toBe(b);
  });

  it("trims and lowercases names before hashing", async () => {
    const a = await generateGuestId("  John  ", "  Smith  ");
    const b = await generateGuestId("john", "smith");
    expect(a).toBe(b);
  });

  it("produces 8-digit suffix (zero-padded when needed)", async () => {
    const id = await generateGuestId("a", "b");
    const suffix = id.split("-")[1];
    expect(suffix).toHaveLength(8);
  });
});

// ── lookupGuest ────────────────────────────────────────────────────────────

describe("lookupGuest", () => {
  beforeEach(() => {
    mockGetDocs.mockReset();
  });

  it("returns snapshot on first attempt (exact name match)", async () => {
    const snap = makeSnap([makeDocSnap({ guestId: "g1" })]);
    mockGetDocs.mockResolvedValueOnce(snap);

    const result = await lookupGuest("John", "Doe");
    expect(result).toBe(snap);
    expect(mockGetDocs).toHaveBeenCalledTimes(1);
  });

  it("falls through to first-name-only match when exact fails", async () => {
    const emptySnap = makeSnap([]);
    const fnSnap = makeSnap([makeDocSnap({ guestId: "g2" })]);
    mockGetDocs
      .mockResolvedValueOnce(emptySnap) // exact match → empty
      .mockResolvedValueOnce(fnSnap); // firstName-only → hit

    const result = await lookupGuest("John", "Doe");
    expect(result).toBe(fnSnap);
    expect(mockGetDocs).toHaveBeenCalledTimes(2);
  });

  it("falls through to last-name-only match when first two attempts fail", async () => {
    const emptySnap = makeSnap([]);
    const lnSnap = makeSnap([makeDocSnap({ guestId: "g3" })]);
    mockGetDocs
      .mockResolvedValueOnce(emptySnap)
      .mockResolvedValueOnce(emptySnap)
      .mockResolvedValueOnce(lnSnap);

    const result = await lookupGuest("John", "Doe");
    expect(result).toBe(lnSnap);
    expect(mockGetDocs).toHaveBeenCalledTimes(3);
  });

  it("returns null when all three attempts fail", async () => {
    mockGetDocs.mockResolvedValue(makeSnap([]));
    const result = await lookupGuest("Ghost", "Person");
    expect(result).toBeNull();
    expect(mockGetDocs).toHaveBeenCalledTimes(3);
  });

  it("trims and lowercases inputs before querying", async () => {
    mockGetDocs.mockResolvedValueOnce(makeSnap([makeDocSnap({ guestId: "g4" })]));
    await lookupGuest("  JOHN  ", "  DOE  ");
    expect(mockWhere).toHaveBeenCalledWith("firstName", "==", "john");
    expect(mockWhere).toHaveBeenCalledWith("lastName", "==", "doe");
  });
});

// ── lookupExistingRsvps ────────────────────────────────────────────────────

describe("lookupExistingRsvps", () => {
  beforeEach(() => mockGetDoc.mockReset());

  it("returns a map of guestId → rsvp data for existing docs", async () => {
    const rsvpData = { guestId: "g1", isDraft: false };
    mockGetDoc.mockResolvedValueOnce(makeDocSnap(rsvpData));

    const result = await lookupExistingRsvps(["g1"]);
    expect(result).toEqual({ g1: rsvpData });
  });

  it("omits guestIds whose doc does not exist", async () => {
    mockGetDoc
      .mockResolvedValueOnce(makeDocSnap({ guestId: "g1" }))
      .mockResolvedValueOnce(missingDocSnap());

    const result = await lookupExistingRsvps(["g1", "g2"]);
    expect(result).toEqual({ g1: { guestId: "g1" } });
    expect(result).not.toHaveProperty("g2");
  });

  it("skips falsy guestIds", async () => {
    const result = await lookupExistingRsvps([null, "", undefined]);
    expect(result).toEqual({});
    expect(mockGetDoc).not.toHaveBeenCalled();
  });

  it("returns empty object when list is empty", async () => {
    const result = await lookupExistingRsvps([]);
    expect(result).toEqual({});
  });

  it("handles multiple guests in parallel", async () => {
    mockGetDoc
      .mockResolvedValueOnce(makeDocSnap({ guestId: "a" }))
      .mockResolvedValueOnce(makeDocSnap({ guestId: "b" }));

    const result = await lookupExistingRsvps(["a", "b"]);
    expect(Object.keys(result)).toHaveLength(2);
  });
});

// ── saveRsvps ──────────────────────────────────────────────────────────────

describe("saveRsvps", () => {
  beforeEach(() => {
    mockSetDoc.mockReset();
    mockSetDoc.mockResolvedValue(undefined);
  });

  it("calls setDoc once per rsvp payload", async () => {
    const rsvps = [
      { guestId: "g1", firstName: "john", lastName: "doe" },
      { guestId: "g2", firstName: "jane", lastName: "doe" },
    ];
    await saveRsvps(rsvps);
    expect(mockSetDoc).toHaveBeenCalledTimes(2);
  });

  it("sets isDraft=false by default", async () => {
    await saveRsvps([{ guestId: "g1", firstName: "a", lastName: "b" }]);
    const [, data] = mockSetDoc.mock.calls[0];
    expect(data.isDraft).toBe(false);
  });

  it("sets isDraft=true when passed explicitly", async () => {
    await saveRsvps([{ guestId: "g1", firstName: "a", lastName: "b" }], true);
    const [, data] = mockSetDoc.mock.calls[0];
    expect(data.isDraft).toBe(true);
  });

  it("includes submittedAt from serverTimestamp()", async () => {
    await saveRsvps([{ guestId: "g1", firstName: "a", lastName: "b" }]);
    const [, data] = mockSetDoc.mock.calls[0];
    expect(data.submittedAt).toBe("__SERVER_TS__");
  });

  it("writes to the rsvps collection keyed by guestId", async () => {
    await saveRsvps([{ guestId: "g1", firstName: "a", lastName: "b" }]);
    expect(mockDoc).toHaveBeenCalledWith(expect.anything(), "rsvps", "g1");
  });

  it("spreads the original payload fields into the doc", async () => {
    const rsvp = { guestId: "g1", firstName: "alice", lastName: "smith", dietary: "vegan" };
    await saveRsvps([rsvp]);
    const [, data] = mockSetDoc.mock.calls[0];
    expect(data).toMatchObject({ guestId: "g1", firstName: "alice", dietary: "vegan" });
  });

  it("handles an empty array without calling setDoc", async () => {
    await saveRsvps([]);
    expect(mockSetDoc).not.toHaveBeenCalled();
  });
});

// ── updateGuestPartyMembers ────────────────────────────────────────────────

describe("updateGuestPartyMembers", () => {
  beforeEach(() => {
    mockUpdateDoc.mockReset();
    mockUpdateDoc.mockResolvedValue(undefined);
  });

  it("calls updateDoc with the correct collection and doc id", async () => {
    await updateGuestPartyMembers("doc-abc", ["gid-1", "gid-2"]);
    expect(mockDoc).toHaveBeenCalledWith(expect.anything(), "guests", "doc-abc");
  });

  it("sets partyMemberIds to the provided array", async () => {
    await updateGuestPartyMembers("doc-abc", ["gid-1", "gid-2"]);
    const [, fields] = mockUpdateDoc.mock.calls[0];
    expect(fields).toEqual({ partyMemberIds: ["gid-1", "gid-2"] });
  });

  it("accepts an empty array (clearing party members)", async () => {
    await updateGuestPartyMembers("doc-abc", []);
    const [, fields] = mockUpdateDoc.mock.calls[0];
    expect(fields).toEqual({ partyMemberIds: [] });
  });
});

// ── updateGuestMemberName ──────────────────────────────────────────────────

describe("updateGuestMemberName", () => {
  beforeEach(() => {
    mockUpdateDoc.mockReset();
    mockUpdateDoc.mockResolvedValue(undefined);
  });

  it("lowercases and trims both names before writing", async () => {
    await updateGuestMemberName("gid-1", "  ALICE  ", "  SMITH  ");
    const [, fields] = mockUpdateDoc.mock.calls[0];
    expect(fields).toEqual({ firstName: "alice", lastName: "smith" });
  });

  it("writes to the guests collection using the guestId", async () => {
    await updateGuestMemberName("gid-99", "bob", "jones");
    expect(mockDoc).toHaveBeenCalledWith(expect.anything(), "guests", "gid-99");
  });
});

// ── lookupNamesByGuestIds ──────────────────────────────────────────────────

describe("lookupNamesByGuestIds", () => {
  beforeEach(() => mockGetDocs.mockReset());

  it("returns a map of guestId → full name", async () => {
    mockGetDocs.mockResolvedValueOnce(
      makeSnap([{ data: () => ({ firstName: "john", lastName: "doe" }) }]),
    );
    const result = await lookupNamesByGuestIds(["g1"]);
    expect(result).toEqual({ g1: "john doe" });
  });

  it("trims the full name (handles empty lastName)", async () => {
    mockGetDocs.mockResolvedValueOnce(
      makeSnap([{ data: () => ({ firstName: "cher", lastName: "" }) }]),
    );
    const result = await lookupNamesByGuestIds(["g1"]);
    expect(result["g1"]).toBe("cher");
  });

  it("omits guestIds whose Firestore query returns empty", async () => {
    mockGetDocs.mockResolvedValueOnce(makeSnap([]));
    const result = await lookupNamesByGuestIds(["ghost"]);
    expect(result).toEqual({});
  });

  it("skips falsy guestIds", async () => {
    const result = await lookupNamesByGuestIds([null, "", undefined]);
    expect(result).toEqual({});
    expect(mockGetDocs).not.toHaveBeenCalled();
  });

  it("queries by guestId field in guests collection", async () => {
    mockGetDocs.mockResolvedValueOnce(
      makeSnap([{ data: () => ({ firstName: "x", lastName: "y" }) }]),
    );
    await lookupNamesByGuestIds(["g1"]);
    expect(mockWhere).toHaveBeenCalledWith("guestId", "==", "g1");
    expect(mockCollection).toHaveBeenCalledWith(expect.anything(), "guests");
  });
});

// ── upsertGuestForMember ───────────────────────────────────────────────────

describe("upsertGuestForMember", () => {
  beforeEach(() => {
    mockGetDocs.mockReset();
    mockSetDoc.mockReset();
    mockSetDoc.mockResolvedValue(undefined);
  });

  it("returns existing guestId when a matching doc is found", async () => {
    mockGetDocs.mockResolvedValueOnce(
      makeSnap([{ data: () => ({ guestId: "existing-id" }) }]),
    );
    const result = await upsertGuestForMember("Jane", "Doe", 2, "parent-1");
    expect(result).toBe("existing-id");
    expect(mockSetDoc).not.toHaveBeenCalled();
  });

  it("returns null when existing doc has no guestId field", async () => {
    mockGetDocs.mockResolvedValueOnce(
      makeSnap([{ data: () => ({}) }]),
    );
    const result = await upsertGuestForMember("Jane", "Doe", 2, "parent-1");
    expect(result).toBeNull();
  });

  it("creates a new guest doc when none is found and returns the new id", async () => {
    mockGetDocs.mockResolvedValueOnce(makeSnap([]));
    const result = await upsertGuestForMember("Jane", "Doe", 2, "parent-1");
    expect(mockSetDoc).toHaveBeenCalledTimes(1);
    expect(result).toMatch(/^janedoe-\d{8}$/);
  });

  it("writes normalized (lowercase, trimmed) names to the new doc", async () => {
    mockGetDocs.mockResolvedValueOnce(makeSnap([]));
    await upsertGuestForMember("  JANE  ", "  DOE  ", 1, "p1");
    const [, docData] = mockSetDoc.mock.calls[0];
    expect(docData.firstName).toBe("jane");
    expect(docData.lastName).toBe("doe");
  });

  it("includes guestCount and empty partyMemberIds in the new doc", async () => {
    mockGetDocs.mockResolvedValueOnce(makeSnap([]));
    await upsertGuestForMember("Jane", "Doe", 3, "p1");
    const [, docData] = mockSetDoc.mock.calls[0];
    expect(docData.guestCount).toBe(3);
    expect(docData.partyMemberIds).toEqual([]);
  });

  it("stores the parentGuestId on the new doc", async () => {
    mockGetDocs.mockResolvedValueOnce(makeSnap([]));
    await upsertGuestForMember("Jane", "Doe", 1, "parent-xyz");
    const [, docData] = mockSetDoc.mock.calls[0];
    expect(docData.parentGuestId).toBe("parent-xyz");
  });

  it("queries with firstName, lastName, and parentGuestId conditions", async () => {
    mockGetDocs.mockResolvedValueOnce(makeSnap([]));
    await upsertGuestForMember("Jane", "Doe", 1, "parent-1");
    expect(mockWhere).toHaveBeenCalledWith("firstName", "==", "jane");
    expect(mockWhere).toHaveBeenCalledWith("lastName", "==", "doe");
    expect(mockWhere).toHaveBeenCalledWith("parentGuestId", "==", "parent-1");
  });
});

// ── notifyGoogleSheets ─────────────────────────────────────────────────────

describe("notifyGoogleSheets", () => {
  it("calls fetch with POST and no-cors mode", () => {
    const mockFetch = vi.fn().mockResolvedValue({});
    vi.stubGlobal("fetch", mockFetch);

    notifyGoogleSheets({ name: "John" });

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("script.google.com"),
      expect.objectContaining({ method: "POST", mode: "no-cors" }),
    );

    vi.unstubAllGlobals();
  });

  it("serializes the payload as JSON in the body", () => {
    const mockFetch = vi.fn().mockResolvedValue({});
    vi.stubGlobal("fetch", mockFetch);

    const payload = { name: "Alice", events: ["haldi"] };
    notifyGoogleSheets(payload);

    const [, options] = mockFetch.mock.calls[0];
    expect(options.body).toBe(JSON.stringify(payload));

    vi.unstubAllGlobals();
  });

  it("uses Content-Type: text/plain header", () => {
    const mockFetch = vi.fn().mockResolvedValue({});
    vi.stubGlobal("fetch", mockFetch);

    notifyGoogleSheets({});

    const [, options] = mockFetch.mock.calls[0];
    expect(options.headers["Content-Type"]).toBe("text/plain");

    vi.unstubAllGlobals();
  });
});
