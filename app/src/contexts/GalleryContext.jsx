import { createContext, useContext, useState, useEffect } from 'react';
import { ref, listAll, getDownloadURL } from 'firebase/storage';
import { storage, auth } from '../firebase_config';
import { signInAnonymously } from 'firebase/auth';


const GalleryContext = createContext();


const useGallery = () => {
    const context = useContext(GalleryContext);
    return context;
};


const GalleryProvider = ({ children }) => {
    const [imageList, setImageList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [authReady, setAuthReady] = useState(false);

    useEffect(() => {
        signInAnonymously(auth)
            .then(() => {
                setAuthReady(true);
            })
            .catch(err => {
                console.error('Auth error:', err);
                setAuthReady(true);
            });
    }, []);

    const fetchImages = async () => {
        setLoading(true);
        try {
            const imageListRef = ref(storage);
            const response = await listAll(imageListRef);
            
            const urlPromises = response.items.map((item) => getDownloadURL(item));
            const urls = await Promise.all(urlPromises);
            
            setImageList(urls);
        } catch (error) {
            console.error('Error fetching images:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (authReady) {
            fetchImages();
        }
    }, [authReady]);

    const value = {
        imageList,
        loading,
        authReady,
        fetchImages,
    };

    return (
        <GalleryContext.Provider value={value}>
            {children}
        </GalleryContext.Provider>
    );
};


export {GalleryProvider, useGallery};