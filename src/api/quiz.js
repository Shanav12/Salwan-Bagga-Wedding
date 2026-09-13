import { collection, addDoc, query, orderBy, limit, onSnapshot, serverTimestamp } from "firebase/firestore"
import { onAuthStateChanged } from 'firebase/auth'
import { db, auth } from "../firebase_config"

const LEADERBOARD_LIMIT = 100;

export async function submitQuizScore(name, numCorrect) {
    await addDoc(collection(db, 'quizleaderboard'), {
        name,
        numCorrect,
        timestamp: serverTimestamp(),
    });
}

// Subscribes to the leaderboard, calling onData(entries) on each update.
// Returns an unsubscribe function. Only subscribes when the user is authenticated.
export function subscribeToLeaderboard({ onData, onError }) {
    let unsubscribeSnapshot = () => {};

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
        unsubscribeSnapshot();
        if (!user) return;

        const leaderboardQuery = query(
            collection(db, 'quizleaderboard'),
            orderBy('numCorrect', 'desc'),
            limit(LEADERBOARD_LIMIT)
        );

        unsubscribeSnapshot = onSnapshot(
            leaderboardQuery,
            (snapshot) => onData(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))),
            onError,
        );
    });

    return () => { unsubscribeAuth(); unsubscribeSnapshot(); };
}
