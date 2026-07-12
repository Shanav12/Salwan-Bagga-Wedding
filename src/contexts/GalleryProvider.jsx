import { useState, useEffect, useCallback, useMemo } from 'react';
import { ref, listAll, getDownloadURL, getMetadata } from 'firebase/storage';
import { storage, auth } from '../firebase_config';
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
            const response = await listAll(ref(storage));
            const imagesWithMetadata = await Promise.all(
                response.items.map(async (item) => {
                    const [url, metadata] = await Promise.all([
                        getDownloadURL(item),
                        getMetadata(item),
                    ]);
                    return { url, timeCreated: metadata.timeCreated };
                })
            );
            const sortedImages = imagesWithMetadata
                .sort((image1, image2) => new Date(image1.timeCreated) - new Date(image2.timeCreated))
                .map(({ url }) => url);
            setImageList(sortedImages);
            writeCache(sortedImages);
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
