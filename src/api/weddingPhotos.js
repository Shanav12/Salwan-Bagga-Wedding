import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { weddingPhotosStorage, db } from "../firebase_config";

export async function fetchWeddingPhotos() {
  const q = query(
    collection(db, "weddingPhotoURLs"),
    orderBy("timeCreated", "asc"),
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data().url).filter(Boolean);
}

export async function saveWeddingPhotoRecord(file, storageRef) {
  const downloadURL = await getDownloadURL(storageRef);
  await addDoc(collection(db, "weddingPhotoURLs"), {
    url: downloadURL,
    storagePath: storageRef.name,
    contentType: file.type,
    size: file.size,
    timeCreated: Timestamp.now(),
    createdAt: Timestamp.now(),
  });
  return downloadURL;
}

export function uploadWeddingPhoto(file, { onProgress, onError, onComplete }) {
  const storageRef = ref(weddingPhotosStorage, `${Date.now()}-${file.name}`);
  const upload = uploadBytesResumable(storageRef, file);
  upload.on(
    "state_changed",
    (snapshot) =>
      onProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100),
    onError,
    () => onComplete(storageRef),
  );
}
