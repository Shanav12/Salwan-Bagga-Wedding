import { query, collection, where, getDocs, addDoc, setDoc, updateDoc, doc, serverTimestamp } from "firebase/firestore"
import { db } from "../firebase_config"
/** @import { GuestDoc, RsvpDoc, MemberRsvpPayload } from "../types" */

const SHEETS_URL = "https://script.google.com/macros/s/AKfycbyIXHCHnBBIII6d8r6Ksq5vcnmpsGLWmTz9Nh9zQtJYjZtsP_BVEGdO6T1voxfvGqu-vQ/exec";



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
        [where("firstName", "==", ""),  where("lastName", "==", ln)],
    ];

    for (const conditions of attempts) {
        const snap = await getDocs(query(collection(db, "guests"), ...conditions));
        if (!snap.empty) return snap;
    }

    return null;
}


/**
 * @param {string[]} memberGuestIds
 * @returns {Promise<Record<string, RsvpDoc & { id: string }>>}
 */
export async function lookupExistingRsvps(memberGuestIds) {
    const results = await Promise.all(
        memberGuestIds.map(async (guestId) => {
            if (!guestId) return null;
            const snap = await getDocs(query(collection(db, "rsvps"), where("guestId", "==", guestId)));
            if (snap.empty) return null;
            return [guestId, { id: snap.docs[0].id, ...snap.docs[0].data() }];
        })
    );
    return Object.fromEntries(results.filter(Boolean));
}


/**
 * @param {MemberRsvpPayload[]} memberRsvps
 * @param {Record<string, string>} existingIds - mutable map of guestId → rsvp doc id
 * @param {boolean} [isDraft]
 * @returns {Promise<void>}
 */
export async function saveRsvps(memberRsvps, existingIds, isDraft = false) {
    await Promise.all(
        memberRsvps.map(async (rsvp) => {
            const data = { ...rsvp, isDraft, submittedAt: serverTimestamp() };
            const existingId = existingIds[rsvp.guestId];
            if (existingId) {
                await setDoc(doc(db, "rsvps", existingId), data);
            } else {
                const ref = await addDoc(collection(db, "rsvps"), data);
                existingIds[rsvp.guestId] = ref.id;
            }
        })
    );
}

/**
 * @param {string} guestDocId - Firestore document id in the guests collection
 * @param {GuestDoc["partyMembers"]} partyMembersArray
 * @param {GuestDoc["partyMemberIds"]} partyMemberIdsArray
 * @returns {Promise<void>}
 */
export async function updateGuestPartyMembers(guestDocId, partyMembersArray, partyMemberIdsArray) {
    await updateDoc(doc(db, "guests", guestDocId), {
        partyMembers: partyMembersArray,
        partyMemberIds: partyMemberIdsArray,
    });
}

/**
 * @param {string} firstName
 * @param {string} lastName
 * @param {number} guestCount
 * @returns {Promise<string>} the guestId (existing or newly created)
 */
export async function upsertGuestForMember(firstName, lastName, guestCount) {
    const fn = firstName.trim().toLowerCase();
    const ln = lastName.trim().toLowerCase();
    const snap = await getDocs(
        query(collection(db, "guests"), where("firstName", "==", fn), where("lastName", "==", ln))
    );
    if (!snap.empty) {
        return snap.docs[0].data().guestId ?? null;
    }
    const newGuestId = crypto.randomUUID();
    await addDoc(collection(db, "guests"), {
        firstName: fn,
        lastName: ln,
        guestCount,
        partyMembers: [],
        partyMemberIds: [],
        guestId: newGuestId,
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
