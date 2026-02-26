import { useState, useEffect } from 'react';
import { ref, listAll, getDownloadURL } from 'firebase/storage';
import { storage, auth } from '../firebase_config';
import { signInAnonymously } from 'firebase/auth';
import { GalleryContext } from './GalleryContext';



const GalleryProvider = ({ children }) => {
    const [imageList, setImageList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [authReady, setAuthReady] = useState(false);

    useEffect(() => {
        signInAnonymously(auth)
            .catch(err => console.error('Auth error:', err))
            .finally(() => setAuthReady(true));
    }, []);

    const fetchImages = async () => {
        setLoading(true);
        try {
            const response = await listAll(ref(storage));
            const urls = await Promise.all(response.items.map(getDownloadURL));
            setImageList(urls);
        } catch (error) {
            console.error('Error fetching images:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (authReady) fetchImages();
    }, [authReady]);

    return (
        <GalleryContext.Provider value={{ imageList, loading, authReady, fetchImages }}>
            {children}
        </GalleryContext.Provider>
    );
};

export default GalleryProvider;