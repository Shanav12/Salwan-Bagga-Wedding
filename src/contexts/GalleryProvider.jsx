import { useState, useEffect, useCallback, useMemo } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db, auth } from '../firebase_config';
import { signInAnonymously } from 'firebase/auth';
import { GalleryContext } from './GalleryContext';

const CACHE_KEY = 'galleryImageCache';
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
        localStorage.setItem(CACHE_KEY, JSON.stringify({ imageList, timestamp: Date.now() }));
    } catch {
        // ignore storage quota/availability errors
    }
};

const GalleryProvider = ({ children }) => {
    const cachedImages = readCache();
    const [imageList, setImageList] = useState(cachedImages ?? []);
    const [loading, setLoading] = useState(!cachedImages);
    const [authReady, setAuthReady] = useState(false);

    useEffect(() => {
        signInAnonymously(auth)
            .catch(err => console.error('Auth error:', err))
            .finally(() => setAuthReady(true));
    }, []);

    const fetchImages = useCallback(async () => {
        setLoading(true);
        try {
            const q = query(collection(db, 'galleryPhotoURLs'), orderBy('timeCreated', 'asc'));
            const snapshot = await getDocs(q);
            const urls = snapshot.docs.map(doc => doc.data().url).filter(Boolean);
            setImageList(urls);
            writeCache(urls);
        } catch (error) {
            console.error('Error fetching images:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (authReady && !cachedImages) fetchImages();
    }, [authReady, fetchImages, cachedImages]);

    const value = useMemo(
        () => ({ imageList, loading, authReady, fetchImages }),
        [imageList, loading, authReady, fetchImages]
    );

    return (
        <GalleryContext.Provider value={value}>
            {children}
        </GalleryContext.Provider>
    );
};

export default GalleryProvider;
