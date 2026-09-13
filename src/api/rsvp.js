import { query, collection, where, getDocs, addDoc, setDoc, doc, serverTimestamp } from "firebase/firestore"
import { db } from "../firebase_config"

const SHEETS_URL = "https://script.google.com/macros/s/AKfycbyIXHCHnBBIII6d8r6Ksq5vcnmpsGLWmTz9Nh9zQtJYjZtsP_BVEGdO6T1voxfvGqu-vQ/exec";



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


export async function lookupExistingRsvps(members) {
    const results = await Promise.all(
        members.map(async (member) => {
            const snap = await getDocs(query(collection(db, "rsvps"), where("name", "==", member)));
            if (snap.empty) return null;
            return [member, { id: snap.docs[0].id, ...snap.docs[0].data() }];
        })
    );
    return Object.fromEntries(results.filter(Boolean));
}


export async function saveRsvps(memberRsvps, existingIds) {
    await Promise.all(
        memberRsvps.map(async (rsvp) => {
            const data = { ...rsvp, submittedAt: serverTimestamp() };
            const existingId = existingIds[rsvp.name];
            if (existingId) {
                await setDoc(doc(db, "rsvps", existingId), data);
            } else {
                await addDoc(collection(db, "rsvps"), data);
            }
        })
    );
}

export function notifyGoogleSheets(payload) {
    fetch(SHEETS_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify(payload),
    });
}
