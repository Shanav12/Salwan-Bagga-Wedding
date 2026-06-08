import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyCUU5rwQEaRf2E-lll3DzUqdzCAduaQ0AI",
  authDomain: "salwan-bagga-wedding-6b25f.firebaseapp.com",
  projectId: "salwan-bagga-wedding-6b25f",
  storageBucket: "salwan-bagga-wedding-6b25f.firebasestorage.app",
  messagingSenderId: "227249034078",
  appId: "1:227249034078:web:f896fb3b21e304a4b2b5cf",
  measurementId: "G-KLZKHFMQ1W"
};

const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);
export const auth = getAuth(app);
export const db = getFirestore(app);


// async function duplicateChecker() {
//   await signInAnonymously(auth);
//   const snapshot = await getDocs(collection(db, "guests"));
 
//   if (snapshot.empty) {
//     console.log("No guests found.");
//     return;
//   }
//   const firstNameCounts = {};

//   snapshot.forEach((doc) => {
//     const { firstName } = doc.data();
//     const key = firstName?.trim().toLowerCase();
//     if (key) firstNameCounts[key] = (firstNameCounts[key] || 0) + 1;
//   });

//   const duplicates = Object.entries(firstNameCounts).filter(([, count]) => count > 1);
//   if (duplicates.length === 0) {
//     console.log("No duplicate first names found.");
//   } else {
//     console.log("Duplicate first names:\n");
//     const duplicateNames = new Set(duplicates.map(([name]) => name));

//     snapshot.forEach((doc) => {
//       const { firstName, lastName, guestCount } = doc.data();
//       if (duplicateNames.has(firstName?.trim().toLowerCase())) {
//         console.log(`  ${firstName} ${lastName} (guests: ${guestCount}) [id: ${doc.id}]`);
//       }
//     });
//   }
// }
 
// duplicateChecker().catch(console.error);


// async function checkNames() {
//   await signInAnonymously(auth);
//   const snapshot = await getDocs(collection(db, "guests"));

//   const expectedNames = [
//       "Arvind", "Manav", "Dadi", "Urmila", "Sita", "Pradeep", "Brij", "Vadera",
//       "Prem", "Manish", "Gunni", "ViK", "Veena", "Raj", "Seema", "Amita",
//       "Ripple", "Beamy", "Aroma", "Kashni", "Noble", "Arsh", "Suvina", "Paru",
//       "Kanu", "Tini", "Rini", "Megha", "Mona", "Shama", "Shivani", "Gaurav",
//       "Bubby", "Indu", "Aman", "Kunal", "Omar", "Ragi", "Rama", "Lali",
//       "Sagari", "Babbu", "Mintu", "Sanjay", "Ekta", "Kampa", "Dhaliwaal",
//       "Ruby", "Tejal", "Jasmine", "Sonia", "Parol", "Fareha", "Taran", "Poonam",
//       "Kamal", "Hemalini", "Meetu", "Banita", "Nita", "Roma", "Nirali", "Rashi",
//       "Ambika", "Reena", "Jaya", "Reshma", "Dipti", "Savitha", "Simran",
//       "Rajeev", "Alisha", "Pete", "Chris", "Anthonys", "Venkat", "Akhil",
//       "Kendra", "Lisa", "Sydney", "Mili", "Rachana", "Grace", "Yooha",
//       "Molly", "Carson", "Kieran", "Narmeen", "Lea",
//       "Sona", "Monika", "Vikrant", "Deepak", "Rahul", "Ajay", "Jay"
//   ];

//   const foundFirstNames = new Set();
//   snapshot.forEach((doc) => {
//     const { firstName } = doc.data();
//     if (firstName) foundFirstNames.add(firstName.trim().toLowerCase());
//   });

//   const missing = expectedNames.filter(
//     (name) => !foundFirstNames.has(name.trim().toLowerCase())
//   );

//   if (missing.length === 0) {
//     console.log("All names found!");
//   } else {
//     console.log(`Missing ${missing.length} names:`);
//     missing.forEach((name) => console.log(`  - ${name}`));
//   }
// }

// checkNames().catch(console.error);