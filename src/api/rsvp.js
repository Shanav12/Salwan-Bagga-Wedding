import {
  query,
  collection,
  where,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase_config";
/** @import { GuestDoc, RsvpDoc, MemberRsvpPayload } from "../types" */

/**
 * @param {string} firstName
 * @param {string} lastName
 * @param {string} [parentGuestId]
 * @returns {Promise<string>}
 */
export async function generateGuestId(firstName, lastName, parentGuestId = "") {
  const slug = `${firstName.trim().toLowerCase()}${lastName.trim().toLowerCase()}`;
  const seed = `wedding2026_${slug}_${parentGuestId}`;
  const buffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(seed));
  const suffix = String(new DataView(buffer).getUint32(0) % 1e8).padStart(8, "0");
  return `${slug}-${suffix}`;
}

const SHEETS_URL =
  "https://script.google.com/macros/s/AKfycbzpE_bl0BwrycXtXdZW61XpwlEhotNvGlqA781xgLw-Rs3ghReRP5abdSKJ81bc8G8rnA/exec";

/**
 * @param {string} firstName
 * @param {string} lastName
 * @returns {Promise<import("firebase/firestore").QuerySnapshot | null>}
 */
export async function lookupGuest(firstName, lastName) {
  const fn = firstName.trim().toLowerCase();
  const ln = lastName.trim().toLowerCase();

  const attempts = [
    [where("firstName", "==", fn), where("lastName", "==", ln)],
    [where("firstName", "==", fn), where("lastName", "==", "")],
    [where("firstName", "==", ""), where("lastName", "==", ln)],
  ];

  for (const conditions of attempts) {
    const snap = await getDocs(query(collection(db, "guests"), ...conditions));
    if (!snap.empty) return snap;
  }

  return null;
}

/**
 * @param {string[]} memberGuestIds
 * @returns {Promise<Record<string, RsvpDoc>>} map of guestId → rsvp data (doc ID equals guestId)
 */
export async function lookupExistingRsvps(memberGuestIds) {
  const results = await Promise.all(
    memberGuestIds.map(async (guestId) => {
      if (!guestId) return null;
      const snap = await getDoc(doc(db, "rsvps", guestId));
      if (!snap.exists()) return null;
      return [guestId, snap.data()];
    }),
  );
  return Object.fromEntries(results.filter(Boolean));
}

/**
 * @param {MemberRsvpPayload[]} memberRsvps
 * @param {boolean} [isDraft]
 * @returns {Promise<void>}
 */
export async function saveRsvps(memberRsvps, isDraft = false) {
  await Promise.all(
    memberRsvps.map(async (rsvp) => {
      const data = { ...rsvp, isDraft, submittedAt: serverTimestamp() };
      await setDoc(doc(db, "rsvps", rsvp.guestId), data);
    }),
  );
}

/**
 * @param {string} guestDocId - Firestore document id in the guests collection
 * @param {GuestDoc["partyMemberIds"]} partyMemberIdsArray
 * @returns {Promise<void>}
 */
export async function updateGuestPartyMembers(guestDocId, partyMemberIdsArray) {
  await updateDoc(doc(db, "guests", guestDocId), {
    partyMemberIds: partyMemberIdsArray,
  });
}

/**
 * @param {string} guestId - used as both the lookup key and doc ID
 * @param {string} firstName
 * @param {string} lastName
 * @returns {Promise<void>}
 */
export async function updateGuestMemberName(guestId, firstName, lastName) {
  await updateDoc(doc(db, "guests", guestId), {
    firstName: firstName.trim().toLowerCase(),
    lastName: lastName.trim().toLowerCase(),
  });
}

/**
 * @param {string[]} guestIds
 * @returns {Promise<Record<string, string>>} map of guestId → full name (lowercase)
 */
export async function lookupNamesByGuestIds(guestIds) {
  const results = await Promise.all(
    guestIds.map(async (guestId) => {
      if (!guestId) return null;
      const snap = await getDocs(
        query(collection(db, "guests"), where("guestId", "==", guestId)),
      );
      if (snap.empty) return null;
      const { firstName, lastName } = snap.docs[0].data();
      return [guestId, `${firstName} ${lastName}`.trim()];
    }),
  );
  return Object.fromEntries(results.filter(Boolean));
}

/**
 * @param {string} firstName
 * @param {string} lastName
 * @param {number} guestCount
 * @param {string} parentGuestId - guestId of the parent/primary guest this member belongs to
 * @returns {Promise<string>} the guestId (existing or newly created)
 */
export async function upsertGuestForMember(
  firstName,
  lastName,
  guestCount,
  parentGuestId,
) {
  const fn = firstName.trim().toLowerCase();
  const ln = lastName.trim().toLowerCase();
  const snap = await getDocs(
    query(
      collection(db, "guests"),
      where("firstName", "==", fn),
      where("lastName", "==", ln),
      where("parentGuestId", "==", parentGuestId),
    ),
  );
  if (!snap.empty) {
    return snap.docs[0].data().guestId ?? null;
  }
  const newGuestId = await generateGuestId(fn, ln, parentGuestId);
  await setDoc(doc(db, "guests", newGuestId), {
    firstName: fn,
    lastName: ln,
    guestCount,
    partyMemberIds: [],
    guestId: newGuestId,
    parentGuestId,
  });
  return newGuestId;
}

/**
 * @param {object} payload
 * @returns {void}
 */
export function notifyGoogleSheets(payload) {
  fetch(SHEETS_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain" },
    body: JSON.stringify(payload),
  });
}
