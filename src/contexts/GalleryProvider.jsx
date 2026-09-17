import { useState, useEffect, useCallback, useMemo } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db, auth } from '../firebase_config';
import { signInAnonymously } from 'firebase/auth';
import { GalleryContext } from './GalleryContext';

const GalleryProvider = ({ children }) => {
    const [imageList, setImageList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [authReady, setAuthReady] = useState(false);

    useEffect(() => {
        localStorage.removeItem('galleryImageCache');
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
        } catch (error) {
            console.error('Error fetching images:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (authReady) fetchImages();
    }, [authReady, fetchImages]);

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
