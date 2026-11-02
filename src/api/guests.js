import {
  collection,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase_config";

function guestId(firstName, lastName) {
  // Mirrors the Python _guest_id logic using Web Crypto
  const seed = `wedding2026_${firstName}_${lastName}`;
  return crypto.subtle
    .digest("SHA-256", new TextEncoder().encode(seed))
    .then((buf) => {
      const suffix = String(new DataView(buf).getUint32(0) % 1e8).padStart(8, "0");
      return `${firstName}${lastName}-${suffix}`;
    });
}

export async function listGuests() {
  const snap = await getDocs(collection(db, "guests"));
  return snap.docs.map((d) => d.data());
}

export async function addGuest(firstName, lastName, guestCount) {
  const first = firstName.trim().toLowerCase();
  const last = lastName.trim().toLowerCase();
  const gid = await guestId(first, last);

  const ref = doc(db, "guests", gid);
  if ((await getDoc(ref)).exists()) {
    throw new Error("Guest already exists");
  }

  const data = {
    guestId: gid,
    firstName: first,
    lastName: last,
    guestCount,
    partyMemberIds: [],
  };
  await setDoc(ref, data);
  return data;
}

export async function deleteGuest(guestId) {
  await deleteDoc(doc(db, "guests", guestId));
}
