import {
  collection,
  addDoc,
  updateDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  getDocs,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../firebase_config";

const LEADERBOARD_LIMIT = 100;

function toTitleCase(str) {
  return str
    .trim()
    .replace(
      /\w\S*/g,
      (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
    );
}

export async function submitQuizScore(name, numCorrect) {
  const titleCasedName = toTitleCase(name);
  const normalizedInput = name.toLowerCase().trim();

  const snapshot = await getDocs(collection(db, "quizleaderboard"));
  const existing = snapshot.docs.find(
    (doc) => doc.data().name.toLowerCase().trim() === normalizedInput,
  );

  if (existing) {
    await updateDoc(existing.ref, {
      name: titleCasedName,
      numCorrect,
      timestamp: serverTimestamp(),
    });
    return { id: existing.id, upserted: true };
  } else {
    const docRef = await addDoc(collection(db, "quizleaderboard"), {
      name: titleCasedName,
      numCorrect,
      timestamp: serverTimestamp(),
    });
    return { id: docRef.id, upserted: false };
  }
}

// Subscribes to the leaderboard, calling onData(entries) on each update.
// Returns an unsubscribe function. Only subscribes when the user is authenticated.
export function subscribeToLeaderboard({ onData, onError }) {
  let unsubscribeSnapshot = () => {};

  const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
    unsubscribeSnapshot();
    if (!user) return;

    const leaderboardQuery = query(
      collection(db, "quizleaderboard"),
      orderBy("numCorrect", "desc"),
      limit(LEADERBOARD_LIMIT),
    );

    unsubscribeSnapshot = onSnapshot(
      leaderboardQuery,
      (snapshot) =>
        onData(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))),
      onError,
    );
  });

  return () => {
    unsubscribeAuth();
    unsubscribeSnapshot();
  };
}
