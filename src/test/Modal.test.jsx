import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import WeddingLogistics from "../components/WeddingLogistics";
import { openModal } from "./rsvpTestHelpers";

vi.mock("react-confetti", () => ({ default: () => null }));
vi.mock("react-use", () => ({ useWindowSize: () => ({ width: 1024, height: 768 }) }));
vi.mock("../assets/saveTheDateBack.png", () => ({ default: "saveTheDateBack.png" }));
vi.mock("react-phone-number-input", () => ({
  default: ({ placeholder, onChange, value }) => (
    <input placeholder={placeholder} value={value ?? ""} onChange={(e) => onChange(e.target.value)} />
  ),
  parsePhoneNumber: () => null,
}));
vi.mock("../api/rsvp", () => ({
  lookupGuest: vi.fn(),
  lookupExistingRsvps: vi.fn(),
  saveRsvps: vi.fn(),
  notifyGoogleSheets: vi.fn(),
}));

describe("RSVP modal — open and close", () => {
  beforeEach(() => {
    render(<WeddingLogistics />);
  });

  it("renders the RSVP Form button on the page", () => {
    expect(screen.getByRole("button", { name: /rsvp form/i })).toBeInTheDocument();
  });

  it("shows the name form when RSVP Form is clicked", () => {
    openModal();
    expect(screen.getByPlaceholderText("First name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Last name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Phone number")).toBeInTheDocument();
  });

  it("closes the modal when Cancel is clicked", async () => {
    openModal();
    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));
    await waitFor(() =>
      expect(screen.queryByPlaceholderText("First name")).not.toBeInTheDocument(),
    );
  });
});
