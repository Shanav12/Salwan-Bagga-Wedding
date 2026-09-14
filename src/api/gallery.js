import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { storage, db } from "../firebase_config";

export async function fetchGalleryImages() {
  const q = query(
    collection(db, "galleryPhotoURLs"),
    orderBy("timeCreated", "asc"),
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data().url).filter(Boolean);
}

export async function savePhotoRecord(file, storageRef) {
  const downloadURL = await getDownloadURL(storageRef);
  await addDoc(collection(db, "galleryPhotoURLs"), {
    url: downloadURL,
    storagePath: storageRef.name,
    contentType: file.type,
    size: file.size,
    timeCreated: Timestamp.now(),
    createdAt: Timestamp.now(),
  });
  return downloadURL;
}

export function uploadPhoto(file, { onProgress, onError, onComplete }) {
  const storageRef = ref(storage, `${Date.now()}-${file.name}`);
  const upload = uploadBytesResumable(storageRef, file);
  upload.on(
    "state_changed",
    (snapshot) =>
      onProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100),
    onError,
    () => onComplete(storageRef),
  );
}
