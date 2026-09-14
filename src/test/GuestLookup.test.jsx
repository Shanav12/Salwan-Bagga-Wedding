import { render, screen, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import WeddingLogistics from "../components/WeddingLogistics";
import { makeSnap, makeDoc, fillStep1 } from "./rsvpTestHelpers";

vi.mock("react-confetti", () => ({ default: () => null }));
vi.mock("react-use", () => ({
  useWindowSize: () => ({ width: 1024, height: 768 }),
}));
vi.mock("../assets/saveTheDateBack.png", () => ({
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
vi.mock("../api/rsvp", () => ({
  lookupGuest: (...args) => mockLookupGuest(...args),
  lookupExistingRsvps: (...args) => mockLookupExistingRsvps(...args),
  saveRsvps: vi.fn(),
  notifyGoogleSheets: vi.fn(),
  updateGuestPartyMembers: vi.fn(),
  upsertGuestForMember: vi.fn().mockResolvedValue(null),
}));

describe("Guest lookup", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLookupExistingRsvps.mockResolvedValue({});
    render(<WeddingLogistics />);
  });

  it("shows an error when no guest is found", async () => {
    mockLookupGuest.mockResolvedValue(null);

    await fillStep1("Ghost", "Person");

    await waitFor(() =>
      expect(screen.getByText(/can't be found/i)).toBeInTheDocument(),
    );
  });

  it("passes the entered names to lookupGuest", async () => {
    mockLookupGuest.mockResolvedValue(makeSnap([makeDoc({ guestCount: 1 })]));

    await fillStep1("Jane", "Smith");

    await waitFor(() => expect(mockLookupGuest).toHaveBeenCalledTimes(1));
    expect(mockLookupGuest).toHaveBeenCalledWith("Jane", "Smith");
  });

  it("uses the first doc when multiple docs exist but none have phoneNumber", async () => {
    mockLookupGuest.mockResolvedValue(
      makeSnap([makeDoc({ guestCount: 2 }), makeDoc({ guestCount: 3 })]),
    );

    await fillStep1("Sam", "Singh");

    await waitFor(() =>
      expect(screen.getByText(/party rsvp/i)).toBeInTheDocument(),
    );
  });

  describe("phone disambiguation", () => {
    it("prompts for phone when multiple docs have phoneNumber and none was entered", async () => {
      mockLookupGuest.mockResolvedValue(
        makeSnap([
          makeDoc({ guestCount: 2, phoneNumber: "4155551234" }),
          makeDoc({ guestCount: 1, phoneNumber: "6505559876" }),
        ]),
      );

      await fillStep1("Sam", "Singh");

      await waitFor(() =>
        expect(
          screen.getByText(/multiple guests share this name/i),
        ).toBeInTheDocument(),
      );
      expect(mockLookupExistingRsvps).not.toHaveBeenCalled();
    });

    it("advances when phone matches a doc", async () => {
      mockLookupGuest.mockResolvedValue(
        makeSnap([
          makeDoc({ guestCount: 2, phoneNumber: "4155551234" }),
          makeDoc({ guestCount: 5, phoneNumber: "6505559876" }),
        ]),
      );

      await fillStep1("Sam", "Singh", "6505559876");

      await waitFor(() =>
        expect(screen.getByText(/party rsvp/i)).toBeInTheDocument(),
      );
    });

    it("shows an error when the entered phone matches no doc", async () => {
      mockLookupGuest.mockResolvedValue(
        makeSnap([
          makeDoc({ guestCount: 2, phoneNumber: "4155551234" }),
          makeDoc({ guestCount: 5, phoneNumber: "6505559876" }),
        ]),
      );

      await fillStep1("Sam", "Singh", "9999999999");

      await waitFor(() =>
        expect(
          screen.getByText(/phone number didn't match/i),
        ).toBeInTheDocument(),
      );
    });

    it("strips non-digits when comparing phone numbers", async () => {
      mockLookupGuest.mockResolvedValue(
        makeSnap([
          makeDoc({ guestCount: 2, phoneNumber: "+1 (415) 555-1234" }),
          makeDoc({ guestCount: 5, phoneNumber: "+1 (650) 555-9876" }),
        ]),
      );

      await fillStep1("Sam", "Singh", "6505559876");

      await waitFor(() =>
        expect(screen.getByText(/party rsvp/i)).toBeInTheDocument(),
      );
    });
  });
});
