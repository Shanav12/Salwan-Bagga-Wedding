import { fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

export function makeSnap(docs = []) {
  return {
    empty: docs.length === 0,
    docs,
    forEach: (fn) => docs.forEach(fn),
  };
}

export function makeDoc(data) {
  const guestId = data.guestId ?? `gid-${Math.random().toString(36).slice(2)}`;
  return { id: `doc-${Math.random()}`, data: () => ({ guestId, ...data }) };
}

export function openModal() {
  fireEvent.click(screen.getByRole("button", { name: /rsvp form/i }));
}

export async function fillStep1(firstName, lastName, phone = "") {
  openModal();
  await userEvent.type(screen.getByPlaceholderText("First name"), firstName);
  await userEvent.type(screen.getByPlaceholderText("Last name"), lastName);
  if (phone) {
    fireEvent.change(screen.getByPlaceholderText("Phone number"), {
      target: { value: phone },
    });
  }
  fireEvent.click(screen.getByRole("button", { name: /continue/i }));
}
