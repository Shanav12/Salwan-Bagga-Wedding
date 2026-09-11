import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import WeddingLogistics from '../components/WeddingLogistics';

// ── Firebase mocks ────────────────────────────────────────────────────────────

const mockGetDocs = vi.fn();
const mockAddDoc = vi.fn();

vi.mock('../firebase_config', () => ({ db: {} }));

vi.mock('firebase/firestore', () => ({
  query: vi.fn((...args) => args),
  collection: vi.fn((db, name) => name),
  where: vi.fn((field, op, val) => ({ field, op, val })),
  getDocs: (...args) => mockGetDocs(...args),
  addDoc: (...args) => mockAddDoc(...args),
}));

vi.mock('react-confetti', () => ({ default: () => null }));

// react-phone-number-input is complex; stub it out
vi.mock('react-phone-number-input', () => ({
  default: ({ placeholder, onChange }) => (
    <input placeholder={placeholder} onChange={e => onChange(e.target.value)} />
  ),
  parsePhoneNumber: () => null,
}));

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeSnapshot(docs = []) {
  return {
    empty: docs.length === 0,
    forEach: fn => docs.forEach(fn),
  };
}

function makeDoc(data) {
  return { data: () => data };
}

function openModal() {
  fireEvent.click(screen.getByRole('button', { name: /rsvp link/i }));
}

async function fillAndSubmit(firstName, lastName, phone = '') {
  openModal();
  await userEvent.type(screen.getByPlaceholderText('First name'), firstName);
  await userEvent.type(screen.getByPlaceholderText('Last name'), lastName);
  if (phone) {
    fireEvent.change(screen.getByPlaceholderText('Phone number'), { target: { value: phone } });
  }
  fireEvent.click(screen.getByRole('button', { name: /continue/i }));
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('RSVP guest lookup', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAddDoc.mockResolvedValue({});
    render(<WeddingLogistics />);
  });

  it('shows the confirmation message when first+last name matches a guest', async () => {
    mockGetDocs.mockResolvedValueOnce(
      makeSnapshot([makeDoc({ guestCount: 3 })])
    );

    await fillAndSubmit('John', 'Doe');

    await waitFor(() =>
      expect(screen.getByText(/3 guests/i)).toBeInTheDocument()
    );
    expect(screen.queryByText(/can't be found/i)).not.toBeInTheDocument();
  });

  it('shows singular "guest" when guestCount is 1', async () => {
    mockGetDocs.mockResolvedValueOnce(
      makeSnapshot([makeDoc({ guestCount: 1 })])
    );

    await fillAndSubmit('Jane', 'Smith');

    await waitFor(() =>
      expect(screen.getByText(/1 guest/i)).toBeInTheDocument()
    );
  });

  it('falls back to firstName + empty lastName and succeeds', async () => {
    // first query (firstName + lastName) misses
    mockGetDocs.mockResolvedValueOnce(makeSnapshot([]));
    // second query (firstName + "") hits
    mockGetDocs.mockResolvedValueOnce(
      makeSnapshot([makeDoc({ guestCount: 2 })])
    );

    await fillAndSubmit('Solo', 'Unknown');

    await waitFor(() =>
      expect(screen.getByText(/2 guests/i)).toBeInTheDocument()
    );
  });

  it('falls back to empty firstName + lastName and succeeds', async () => {
    mockGetDocs.mockResolvedValueOnce(makeSnapshot([])); // firstName+lastName miss
    mockGetDocs.mockResolvedValueOnce(makeSnapshot([])); // firstName+"" miss
    mockGetDocs.mockResolvedValueOnce(               // ""+lastName hit
      makeSnapshot([makeDoc({ guestCount: 4 })])
    );

    await fillAndSubmit('Unknown', 'Family');

    await waitFor(() =>
      expect(screen.getByText(/4 guests/i)).toBeInTheDocument()
    );
  });

  it('shows an error when no query finds the guest', async () => {
    mockGetDocs.mockResolvedValue(makeSnapshot([]));

    await fillAndSubmit('Ghost', 'Person');

    await waitFor(() =>
      expect(
        screen.getByText(/can't be found/i)
      ).toBeInTheDocument()
    );
    expect(screen.queryByText(/we've reserved/i)).not.toBeInTheDocument();
  });

  it('does not call Firestore when first name is blank', async () => {
    openModal();
    // Leave first name empty, only fill last name
    await userEvent.type(screen.getByPlaceholderText('Last name'), 'Doe');

    // Continue button should be disabled
    expect(
      screen.getByRole('button', { name: /continue/i })
    ).toBeDisabled();

    expect(mockGetDocs).not.toHaveBeenCalled();
  });

  it('does not call Firestore when last name is blank', async () => {
    openModal();
    await userEvent.type(screen.getByPlaceholderText('First name'), 'John');

    expect(
      screen.getByRole('button', { name: /continue/i })
    ).toBeDisabled();

    expect(mockGetDocs).not.toHaveBeenCalled();
  });

  it('logs the RSVP initialization to Firestore after a successful lookup', async () => {
    mockGetDocs.mockResolvedValueOnce(
      makeSnapshot([makeDoc({ guestCount: 2 })])
    );

    await fillAndSubmit('Ambika', 'Bagga');

    await waitFor(() => expect(mockAddDoc).toHaveBeenCalledTimes(1));

    const [, payload] = mockAddDoc.mock.calls[0];
    expect(payload.firstName).toBe('Ambika');
    expect(payload.lastName).toBe('Bagga');
  });

  it('shows a special greeting for known VIP names', async () => {
    mockGetDocs.mockResolvedValueOnce(
      makeSnapshot([makeDoc({ guestCount: 1 })])
    );

    await fillAndSubmit('Ambika', 'Anyone');

    await waitFor(() =>
      expect(screen.getByText(/bride/i)).toBeInTheDocument()
    );
  });

  it('shows the generic greeting for non-VIP names', async () => {
    mockGetDocs.mockResolvedValueOnce(
      makeSnapshot([makeDoc({ guestCount: 2 })])
    );

    await fillAndSubmit('Alice', 'Wonderland');

    await waitFor(() =>
      expect(screen.getByText(/hi alice/i)).toBeInTheDocument()
    );
  });

  // ── Phone disambiguation ──────────────────────────────────────────────────

  it('uses the first doc when multiple docs exist but none have a phoneNumber field', async () => {
    mockGetDocs.mockResolvedValueOnce(
      makeSnapshot([
        makeDoc({ guestCount: 2 }),
        makeDoc({ guestCount: 3 }),
      ])
    );

    await fillAndSubmit('Sam', 'Singh');

    await waitFor(() =>
      expect(screen.getByText(/2 guests/i)).toBeInTheDocument()
    );
  });

  it('prompts for phone when multiple docs have phoneNumber and no phone was entered', async () => {
    mockGetDocs.mockResolvedValueOnce(
      makeSnapshot([
        makeDoc({ guestCount: 2, phoneNumber: '4155551234' }),
        makeDoc({ guestCount: 1, phoneNumber: '6505559876' }),
      ])
    );

    await fillAndSubmit('Sam', 'Singh');

    await waitFor(() =>
      expect(screen.getByText(/multiple guests share this name/i)).toBeInTheDocument()
    );
    expect(screen.queryByText(/we've reserved/i)).not.toBeInTheDocument();
  });

  it('disambiguates by phone number when multiple docs have phoneNumber and phone matches', async () => {
    mockGetDocs.mockResolvedValueOnce(
      makeSnapshot([
        makeDoc({ guestCount: 2, phoneNumber: '4155551234' }),
        makeDoc({ guestCount: 5, phoneNumber: '6505559876' }),
      ])
    );

    await fillAndSubmit('Sam', 'Singh', '6505559876');

    await waitFor(() =>
      expect(screen.getByText(/5 guests/i)).toBeInTheDocument()
    );
  });

  it('shows an error when phone is entered but matches no doc', async () => {
    mockGetDocs.mockResolvedValueOnce(
      makeSnapshot([
        makeDoc({ guestCount: 2, phoneNumber: '4155551234' }),
        makeDoc({ guestCount: 5, phoneNumber: '6505559876' }),
      ])
    );

    await fillAndSubmit('Sam', 'Singh', '9999999999');

    await waitFor(() =>
      expect(screen.getByText(/phone number didn't match/i)).toBeInTheDocument()
    );
    expect(screen.queryByText(/we've reserved/i)).not.toBeInTheDocument();
  });

  it('matches phone number with different formatting (strips non-digits)', async () => {
    mockGetDocs.mockResolvedValueOnce(
      makeSnapshot([
        makeDoc({ guestCount: 2, phoneNumber: '+1 (415) 555-1234' }),
        makeDoc({ guestCount: 5, phoneNumber: '+1 (650) 555-9876' }),
      ])
    );

    // Enter just the 10-digit national number — should still match
    await fillAndSubmit('Sam', 'Singh', '6505559876');

    await waitFor(() =>
      expect(screen.getByText(/5 guests/i)).toBeInTheDocument()
    );
  });
});
