import { useState, useEffect, useCallback, useMemo } from "react";
import { auth } from "../firebase_config";
import { signInAnonymously } from "firebase/auth";
import { fetchGalleryImages } from "../api/gallery";
import { GalleryContext } from "./GalleryContext";

const CACHE_KEY = "galleryImageCache";
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

const readCache = () => {
  try {
    const cached = JSON.parse(localStorage.getItem(CACHE_KEY));
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return cached.imageList;
    }
  } catch {
    // ignore malformed cache
  }
  return null;
};

const writeCache = (imageList) => {
  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ imageList, timestamp: Date.now() }),
    );
  } catch {
    // ignore storage quota/availability errors
  }
};

const GalleryProvider = ({ children }) => {
  const [imageList, setImageList] = useState(() => readCache() ?? []);
  const [loading, setLoading] = useState(() => readCache() === null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    signInAnonymously(auth)
      .catch((err) => console.error("Auth error:", err))
      .finally(() => setAuthReady(true));
  }, []);

  const fetchImages = useCallback(async () => {
    setLoading(true);
    try {
      const urls = await fetchGalleryImages();
      setImageList(urls);
      writeCache(urls);
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authReady && loading) fetchImages();
  }, [authReady, fetchImages, loading]);

  const value = useMemo(
    () => ({ imageList, loading, authReady, fetchImages }),
    [imageList, loading, authReady, fetchImages],
  );

  return (
    <GalleryContext.Provider value={value}>{children}</GalleryContext.Provider>
  );
};

export default GalleryProvider;
