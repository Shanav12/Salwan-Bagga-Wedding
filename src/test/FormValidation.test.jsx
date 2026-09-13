import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

const mockLookupGuest = vi.fn();
vi.mock("../api/rsvp", () => ({
  lookupGuest: (...args) => mockLookupGuest(...args),
  lookupExistingRsvps: vi.fn(),
  saveRsvps: vi.fn(),
  notifyGoogleSheets: vi.fn(),
}));

describe("RSVP form — Continue button validation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    render(<WeddingLogistics />);
  });

  it("disables Continue when first name is blank", async () => {
    openModal();
    await userEvent.type(screen.getByPlaceholderText("Last name"), "Doe");
    expect(screen.getByRole("button", { name: /continue/i })).toBeDisabled();
    expect(mockLookupGuest).not.toHaveBeenCalled();
  });

  it("disables Continue when last name is blank", async () => {
    openModal();
    await userEvent.type(screen.getByPlaceholderText("First name"), "John");
    expect(screen.getByRole("button", { name: /continue/i })).toBeDisabled();
    expect(mockLookupGuest).not.toHaveBeenCalled();
  });

  it("enables Continue when both names are filled", async () => {
    openModal();
    await userEvent.type(screen.getByPlaceholderText("First name"), "John");
    await userEvent.type(screen.getByPlaceholderText("Last name"), "Doe");
    expect(screen.getByRole("button", { name: /continue/i })).not.toBeDisabled();
  });
});
