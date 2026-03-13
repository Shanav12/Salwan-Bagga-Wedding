import { ref, uploadBytesResumable } from 'firebase/storage';
import { useState, useEffect, useRef } from "react";
import { storage } from '../firebase_config';
import { useGallery } from '../contexts/GalleryContext';



const Gallery = () => {
    const { imageList, loading, fetchImages } = useGallery();
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [showSuccess, setShowSuccess] = useState(false);
    const [currIdx, setCurrIdx] = useState(0);
    const [galleryView, setGalleryView] = useState(false);
    const intervalRef = useRef(null);
    const focusRef = useRef(null);
    const [focusedImg, setFocusedImg] = useState(null);


    useEffect(() => {
        if (showSuccess) {
            const timer = setTimeout(() => {
                setShowSuccess(false);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [showSuccess]);

    useEffect(() => {
        imageList.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }, [imageList]);

    const handleFileChange = (e) => {
        if (e.target.files) {
            setFiles(e.target.files);
        }
    }

    const handleUpload = () => {
        if (!files || files.length === 0) {
            return;
        }
        setUploading(true);
        
        let completedUploads = 0;
        const totalFiles = files.length;
        
        Array.from(files).forEach((file) => {
            const currRef = ref(storage, `${Date.now()}-${file.name}`);
            const upload = uploadBytesResumable(currRef, file); 
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
                    completedUploads++;
                    if (completedUploads === totalFiles) {
                        setUploading(false);
                        setUploadProgress(0);
                        setFiles([]);
                        setShowSuccess(true);
                        fetchImages();
                    }
                }
            )
        })
    }

    const startInterval = () => {
        if (imageList.length > 1) {
            clearInterval(intervalRef.current);
            intervalRef.current = setInterval(() => {
                setCurrIdx(prev => (prev + 1) % imageList.length);
            }, 3000);
        }
    };

    useEffect(() => {
        startInterval();
        return () => clearInterval(intervalRef.current);
    }, [imageList.length]);

    const handlePrevious = () => {
        setCurrIdx((prev) => {
            return prev === 0 ? imageList.length - 1 : prev - 1;
        });
        startInterval();
    };

    const handleNext = () => {
        setCurrIdx((prev) => {
            return prev === imageList.length - 1 ? 0 : prev + 1;
        });
        startInterval();
    };

    const handleFocus = () => {
        if (focusRef.current) {
            focusRef.current.focus()
        }
    }


    return (
        <div className="min-h-full bg-[#faf0e6] py-14 px-4 overflow-x-hidden">
            {showSuccess && (
                <div className="fixed top-4 md:top-8 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in-down px-4 w-full max-w-md">
                    <div className="bg-[#fdfbf7] border-2 border-[#991D00] rounded-lg px-4 md:px-6 py-3 md:py-4 shadow-xl flex items-center gap-2 md:gap-3">
                        <span className="text-[#991D00] text-xl md:text-2xl">✓</span>
                        <p className="text-[#3B3B3B] font-medium text-sm md:text-base">Photo uploaded successfully!</p>
                    </div>
                </div>
            )}

            <div className="text-center mb-8">
                <h1 className="font-prata text-5xl md:text-6xl text-[#4a4a4a] mb-4">Photo Gallery</h1>
                <div className="flex items-center justify-center gap-3 md:gap-4 mt-4 md:mt-6">
                    <span className="h-px w-12 md:w-16 bg-[#691700]"></span>
                    <span className="text-[#991D00] text-xl md:text-2xl">♥</span>
                    <span className="h-px w-12 md:w-16 bg-[#691700]"></span>
                </div>
                <p className="font-prata mt-4 md:mt-6 text-lg md:text-xl text-[#5a5a5a] tracking-wide">
                    Share pictures of your favorite memories with us!
                </p>
            </div>

            <section className="max-w-2xl mx-auto px-4 md:px-6 py-3 md:py-4">
                <div className="bg-[#fdfbf7] border-2 border-[#691700] rounded-lg p-4 md:p-6 shadow-md">
                    <h2 className="font-prata text-2xl md:text-3xl text-[#4a4a4a] mb-3 md:mb-4 text-center">
                        Upload Photos
                    </h2>
                    <div className="flex items-center justify-center gap-2 md:gap-3 mb-4 md:mb-6">
                        <span className="h-px w-8 md:w-12 bg-[#691700]"></span>
                        <span className="text-[#991D00] text-sm md:text-base">✦</span>
                        <span className="h-px w-8 md:w-12 bg-[#691700]"></span>
                    </div>
                    
                    <div className="flex flex-col items-center gap-3 md:gap-4">
                        <label className="cursor-pointer w-full md:w-auto">
                            <input 
                                type="file" 
                                accept='image/*' 
                                onChange={handleFileChange}
                                className="hidden"
                                name="files[]"
                                multiple
                            />
                            <span className="font-prata inline-block w-full md:w-auto text-center bg-[#fdfbf7] border-2 border-[#691700] text-[#991D00] px-4 md:px-6 py-2 md:py-3 rounded-lg hover:bg-[#691700] hover:text-[#fdfbf7] transition-colors duration-200 font-medium text-sm md:text-base">
                                {files.length > 0 ? files.length + ' photo(s)' : 'Choose Photo(s)'}
                            </span>
                        </label>
                        
                        <button 
                            onClick={handleUpload} 
                            disabled={uploading || files.length == 0}
                            className="font-prata w-full md:w-auto bg-[#991D00] text-[#fdfbf7] px-6 md:px-8 py-2 md:py-3 rounded-lg hover:bg-[#691700] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 font-medium shadow-md text-sm md:text-base"
                        >
                            {uploading ? 'Uploading...' : 'Upload Photo(s)'}
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
                <h2 className="font-prata text-3xl md:text-4xl lg:text-5xl text-[#4a4a4a] mb-2 text-center">
                    Memories
                </h2>
                <div className="flex items-center justify-center gap-2 md:gap-3 mb-4 md:mb-6">
                    <span className="h-px w-8 md:w-12 bg-[#691700]"></span>
                    <span className="text-[#991D00] text-sm md:text-base">✦</span>
                    <span className="h-px w-8 md:w-12 bg-[#691700]"></span>
                </div>

                <button 
                    className={`font-prata flex items-center gap-2 mx-auto mb-8 px-5 md:px-7 py-2.5 md:py-3 rounded-lg border-2 transition-all duration-300 shadow-sm text-sm md:text-base bg-[#fdfbf7] 
                    text-[#991D00] border-[#691700] hover:bg-[#691700] hover:text-[#fdfbf7]`}
                    onClick={() => setGalleryView(prev => !prev)}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                    {galleryView ? 'Slideshow View' : 'Gallery View'}
                </button>

                {loading ? (
                    <p className="font-prata text-center text-[#5a5a5a] text-lg md:text-xl">Loading photos...</p>
                ) : imageList.length === 0 ? (
                    <p className="font-prata text-center text-[#5a5a5a] text-lg md:text-xl px-4">No photos yet. Be the first to share!</p>
                ) : !galleryView ? (
                    <div className="relative">
                        <div className="flex justify-center mb-6">
                            <div className="relative w-half max-w-4xl">
                                <div className="absolute inset-0 bg-[#691700] rounded-lg transform rotate-1"></div>
                                <img 
                                    src={imageList[currIdx]} 
                                    className="relative rounded-lg shadow-xl w-half h-[350px] sm:h-[400px] md:h-[500px] lg:h-[500px] object-cover"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-center gap-4 md:gap-6">
                            <button
                                onClick={handlePrevious}
                                className="bg-[#fdfbf7] border-2 border-[#691700] text-[#991D00] p-2 md:p-3 rounded-full hover:bg-[#691700] hover:text-[#fdfbf7] transition-colors duration-200 shadow-md"
                                aria-label="Previous photo"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <div className="text-center min-w-[80px] md:min-w-[100px]">
                                <p className="text-[#5a5a5a] text-base md:text-lg font-medium">
                                    {currIdx + 1} / {imageList.length}
                                </p>
                            </div>
                            <button
                                onClick={handleNext}
                                className="bg-[#fdfbf7] border-2 border-[#691700] text-[#991D00] p-2 md:p-3 rounded-full hover:bg-[#691700] hover:text-[#fdfbf7] transition-colors duration-200 shadow-md"
                                aria-label="Next photo"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>

                        <div className="flex justify-center gap-1.5 md:gap-2 mt-6 flex-wrap max-w-md mx-auto">
                            {imageList.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrIdx(index)}
                                    className={`w-2 h-2 font-prata rounded-full transition-all duration-200 ${
                                        index === currIdx 
                                            ? 'bg-[#991D00] w-6 md:w-8' 
                                            : 'bg-[#691700] opacity-40 hover:opacity-70'
                                    }`}
                                    aria-label={`Go to photo ${index + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 md:gap-4 space-y-3 md:space-y-4">
                        {focusedImg && (
                            <div
                                className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
                                onClick={() => setFocusedImg(null)}
                            >
                                <div
                                    className="relative max-w-5xl max-h-[90vh]"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <img
                                        src={focusedImg}
                                        className="max-w-full max-h-[90vh] rounded-lg shadow-2xl object-contain"
                                    />
                                    <button
                                        onClick={() => setFocusedImg(null)}
                                        className="absolute -top-4 -right-4 bg-[#fdfbf7] border-2 border-[#691700] text-[#991D00] w-9 h-9 rounded-full flex items-center justify-center hover:bg-[#691700] hover:text-[#fdfbf7] transition-colors shadow-md text-lg font-bold"
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>
                        )}
                        {imageList.map((img, index) => (
                            <div key={index} className="break-inside-avoid relative group cursor-pointer">
                                <div className="absolute inset-0 bg-[#691700] rounded-lg transform translate-x-0.5 translate-y-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                                <img
                                    src={img}
                                    alt={`Memory ${index + 1}`}
                                    onClick={() => setFocusedImg(img)}
                                    className="relative w-full rounded-lg shadow-md object-cover transition-transform duration-200 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5"
                                />
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    )
}

export default Gallery;