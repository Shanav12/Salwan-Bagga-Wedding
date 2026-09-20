import { render, screen, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import WeddingLogistics from "../WeddingLogistics";
import { makeSnap, makeDoc, fillStep1 } from "./rsvpTestHelpers";

vi.mock("react-confetti", () => ({ default: () => null }));
vi.mock("react-use", () => ({
  useWindowSize: () => ({ width: 1024, height: 768 }),
}));
vi.mock("../../assets/saveTheDateBack.png", () => ({
  default: "saveTheDateBack.png",
}));
vi.mock("react-phone-number-input", () => ({
  default: ({ placeholder, onChange, value }) => (
    <input
      placeholder={placeholder}
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
  parsePhoneNumber: () => null,
}));

const mockLookupGuest = vi.fn();
const mockLookupExistingRsvps = vi.fn();
vi.mock("../../api/rsvp", () => ({
  lookupGuest: (...args) => mockLookupGuest(...args),
  lookupExistingRsvps: (...args) => mockLookupExistingRsvps(...args),
  saveRsvps: vi.fn(),
  notifyGoogleSheets: vi.fn(),
  updateGuestPartyMembers: vi.fn(),
  upsertGuestForMember: vi.fn().mockResolvedValue(null),
}));

describe("RSVP flow — step routing", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    render(<WeddingLogistics />);
  });

  it("shows Party RSVP (Step 3) when guest is found with no existing RSVP", async () => {
    mockLookupGuest.mockResolvedValue(makeSnap([makeDoc({ guestCount: 2 })]));
    mockLookupExistingRsvps.mockResolvedValue({});

    await fillStep1("John", "Doe");

    await waitFor(() =>
      expect(screen.getByText(/party rsvp/i)).toBeInTheDocument(),
    );
  });

  it("shows Thank You (Step 2) when guest already has an RSVP on file", async () => {
    const guestDoc = makeDoc({ guestCount: 1 });
    const guestId = guestDoc.data().guestId;
    mockLookupGuest.mockResolvedValue(makeSnap([guestDoc]));
    mockLookupExistingRsvps.mockResolvedValue({
      [guestId]: { id: "abc", events: {}, dietaryRestrictions: "" },
    });

    await fillStep1("John", "Doe");

    await waitFor(() =>
      expect(
        screen.getByText(/we already have your rsvp on file/i),
      ).toBeInTheDocument(),
    );
  });

  describe("greeting in Step 2", () => {
    it("uses the NAME_ROLES title for known VIPs (e.g. Ambika Salwan → Bride)", async () => {
      const guestDoc = makeDoc({ guestCount: 1 });
      const guestId = guestDoc.data().guestId;
      mockLookupGuest.mockResolvedValue(makeSnap([guestDoc]));
      mockLookupExistingRsvps.mockResolvedValue({
        [guestId]: { id: "x", events: {}, dietaryRestrictions: "" },
      });

      await fillStep1("Ambika", "Salwan");

      await waitFor(() =>
        expect(screen.getByText(/hi bride!/i)).toBeInTheDocument(),
      );
    });

    it("falls back to first name for guests not in NAME_ROLES", async () => {
      const guestDoc = makeDoc({ guestCount: 2 });
      const guestId = guestDoc.data().guestId;
      mockLookupGuest.mockResolvedValue(makeSnap([guestDoc]));
      mockLookupExistingRsvps.mockResolvedValue({
        [guestId]: { id: "y", events: {}, dietaryRestrictions: "" },
      });

      await fillStep1("Alice", "Wonderland");

      await waitFor(() =>
        expect(screen.getByText(/hi alice!/i)).toBeInTheDocument(),
      );
    });
  });

  it("lists party members from the guest doc in Step 3", async () => {
    mockLookupGuest.mockResolvedValue(
      makeSnap([
        makeDoc({
          guestCount: 2,
          partyMembers: ["jane doe"],
          partyMemberIds: ["gid-jane"],
        }),
      ]),
    );
    mockLookupExistingRsvps.mockResolvedValue({});

    await fillStep1("John", "Doe");

    await waitFor(() =>
      expect(screen.getByText(/john doe/i)).toBeInTheDocument(),
    );
    expect(screen.getByDisplayValue(/jane doe/i)).toBeInTheDocument();
  });
});
