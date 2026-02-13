import { ref, uploadBytesResumable, listAll, getDownloadURL } from 'firebase/storage';
import { useState, useEffect } from "react";
import { storage, auth } from '../firebase_config';
import { signInAnonymously } from 'firebase/auth';



const Gallery = () => {
    const [file, setFile] = useState(null);
    const [imageList, setImageList] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showSuccess, setShowSuccess] = useState(false);
    const [currIdx, setCurrIdx] = useState(0);
    const [fadeIn, setFadeIn] = useState(true);
    const [authReady, setAuthReady] = useState(false);

    useEffect(() => {
        signInAnonymously(auth).then().catch(err => console.log(err));
        setAuthReady(true);
    }, []);


    useEffect(() => {
        if (showSuccess) {
            const timer = setTimeout(() => {
                setShowSuccess(false);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [showSuccess]);


    useEffect(() => {
        if (imageList.length > 1) {
            const interval = setInterval(() => {
                setFadeIn(false);
                setTimeout(() => {
                    setCurrIdx((prev) => {
                        const nextIndex = prev + 1;
                        return nextIndex >= imageList.length ? 0 : nextIndex;
                    });
                    setFadeIn(true);
                }, 500);
            }, 3000);
            return () => clearInterval(interval);
        }
    }, [imageList.length, imageList]);


    useEffect(() => {
        if (currIdx >= imageList.length && imageList.length > 0) {
            setCurrIdx(0);
        }
    }, [imageList.length, currIdx]);


    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setFile(e.target.files[0])
        }
    };

    const handleUpload = () => {
        if (!file) {
            return;
        }
        setUploading(true);
        const storageRef = ref(storage, `${file.name}-${Date.now()}`);
        const upload = uploadBytesResumable(storageRef, file); 
        upload.on(
            'state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setUploadProgress(progress);
            },
            (error) => {
                console.error('Upload error:', error);
                setUploading(false);
            },
            () => {
                setUploading(false);
                setUploadProgress(0);
                setFile(null);
                setShowSuccess(true);
                fetchImages();
            }
        )   
    };

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
    }, [authReady])


    return (
        <div className="min-h-screen bg-[#faf0e6]">
            {showSuccess && (
                <div className="fixed top-4 md:top-8 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in-down px-4 w-full max-w-md">
                    <div className="bg-[#fdfbf7] border-2 border-[#991D00] rounded-lg px-4 md:px-6 py-3 md:py-4 shadow-xl flex items-center gap-2 md:gap-3">
                        <span className="text-[#991D00] text-xl md:text-2xl">✓</span>
                        <p className="text-[#3B3B3B] font-medium text-sm md:text-base">Photo uploaded successfully!</p>
                    </div>
                </div>
            )}

            <header className="pt-8 md:pt-16 pb-6 md:pb-8 text-center px-4">
                <div className="text-center mb-16">
                    <h1 className="font-serif text-5xl md:text-7xl text-[#4a4a4a] mb-4">Gallery</h1>
                    <div className="flex items-center justify-center gap-4">
                        <span className="h-px w-12 md:w-16 bg-[#691700]"></span>
                        <span className="text-[#991D00] text-2xl md:text-3xl">♥</span>
                        <span className="h-px w-12 md:w-16 bg-[#691700]"></span>
                    </div>
                </div>
                <p className="mt-4 md:mt-6 text-lg md:text-xl text-[#5a5a5a] tracking-wide">
                    Share your favorite moments with us!
                </p>
            </header>

            <section className="max-w-2xl mx-auto px-4 md:px-6 py-6 md:py-8">
                <div className="bg-[#fdfbf7] border-2 border-[#691700] rounded-lg p-4 md:p-6 shadow-md">
                    <h2 className="font-serif text-2xl md:text-3xl text-[#4a4a4a] mb-3 md:mb-4 text-center">
                        Upload Photos
                        <div className="flex items-center justify-center gap-2 md:gap-3 mb-4 md:mb-6">
                            <span className="h-px w-8 md:w-12 bg-[#691700]"></span>
                            <span className="text-[#991D00] text-sm md:text-base">✦</span>
                            <span className="h-px w-8 md:w-12 bg-[#691700]"></span>
                        </div>
                    </h2>
                    
                    <div className="flex flex-col items-center gap-3 md:gap-4">
                        <label className="cursor-pointer w-full md:w-auto">
                            <input 
                                type="file" 
                                accept='image/*' 
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            <span className="inline-block w-full md:w-auto text-center bg-[#fdfbf7] border-2 border-[#691700] text-[#991D00] px-4 md:px-6 py-2 md:py-3 rounded-lg hover:bg-[#691700] hover:text-[#fdfbf7] transition-colors duration-200 font-medium text-sm md:text-base">
                                {file ? (file.name.length > 30 ? file.name.substring(0, 30) + '...' : file.name) : 'Choose Photo'}
                            </span>
                        </label>
                        
                        <button 
                            onClick={handleUpload} 
                            disabled={uploading || !file}
                            className="w-full md:w-auto bg-[#991D00] text-[#fdfbf7] px-6 md:px-8 py-2 md:py-3 rounded-lg hover:bg-[#691700] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 font-medium shadow-md text-sm md:text-base"
                        >
                            {uploading ? 'Uploading...' : 'Upload Photo'}
                        </button>
                        
                        {uploading && (
                            <div className="w-full">
                                <p className="text-[#5a5a5a] text-center mb-2 text-sm md:text-base">
                                    Upload Progress: {uploadProgress.toFixed(0)}%
                                </p>
                                <div className="w-full bg-gray-200 rounded-full h-2 md:h-3 overflow-hidden">
                                    <div 
                                        className="bg-[#991D00] h-full transition-all duration-300 rounded-full"
                                        style={{ width: `${uploadProgress}%` }}
                                    ></div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <section className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-8">
                <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#4a4a4a] mb-2 text-center">
                    Our Moments
                    <div className="flex items-center justify-center gap-2 md:gap-3 mb-6 md:mb-8">
                        <span className="h-px w-8 md:w-12 bg-[#691700]"></span>
                        <span className="text-[#991D00] text-sm md:text-base">✦</span>
                        <span className="h-px w-8 md:w-12 bg-[#691700]"></span>
                    </div>
                </h2>

                {loading ? (
                    <p className="text-center text-[#5a5a5a] text-lg md:text-xl">Loading photos...</p>
                ) : imageList.length === 0 ? (
                    <p className="text-center text-[#5a5a5a] text-lg md:text-xl px-4">No photos yet. Be the first to share!</p>
                ) : (
                    <div className="flex justify-center">
                        <div className="relative w-half">
                            <div className="absolute inset-0 bg-[#691700] rounded-lg transform rotate-1"></div>
                            <img 
                                src={imageList[currIdx]} 
                                className={`relative rounded-lg shadow-xl w-half h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] object-cover transition-opacity duration-500 ${
                                    fadeIn ? 'opacity-100' : 'opacity-0'
                                }`}
                            />
                        </div>
                    </div>
                )}
            </section>
        </div>
    )
}

export default Gallery;