import { useState, useEffect } from "react";
import { useGallery } from "../contexts/GalleryContext";

const CACHE_KEY = "memoriesImageCache";

const Gallery = () => {
  const { imageList, loading } = useGallery();
  const [cachedImages, setCachedImages] = useState(() => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });
  const [focusedIdx, setFocusedIdx] = useState(null);

  const images = imageList.length > 0 ? imageList : cachedImages;

  useEffect(() => {
    if (imageList.length > 0) {
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(imageList));
        setCachedImages(imageList);
      } catch {
        // localStorage quota exceeded — skip caching
      }
    }
  }, [imageList]);

  useEffect(() => {
    images.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [images]);

  useEffect(() => {
    const handleKey = (e) => {
      if (focusedIdx === null) return;
      if (e.key === "ArrowRight") setFocusedIdx((i) => (i + 1) % images.length);
      if (e.key === "ArrowLeft") setFocusedIdx((i) => (i - 1 + images.length) % images.length);
      if (e.key === "Escape") setFocusedIdx(null);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [focusedIdx, images.length]);

  return (
    <div className="min-h-full bg-[#faf0e6] py-10 px-4 overflow-x-hidden">
      <div className="text-center mb-6">
        <h1 className="font-prata text-4xl md:text-5xl text-[#4a4a4a] mb-3">
          Memories
        </h1>
        <div className="flex items-center justify-center gap-3 md:gap-4 mt-3 md:mt-4">
          <span className="h-px w-10 md:w-14 bg-[#691700]"></span>
          <span className="text-[#991D00] text-lg md:text-xl">♥</span>
          <span className="h-px w-10 md:w-14 bg-[#691700]"></span>
        </div>
        <p className="font-prata mt-3 md:mt-4 text-base md:text-lg text-[#5a5a5a] tracking-wide">
          A collection of our favorite moments together.
        </p>
      </div>

      <section className="max-w-6xl mx-auto px-4 md:px-6 py-4 md:py-6">
        <div className="bg-[#f3e6d8] border border-[#691700] rounded-2xl p-4 md:p-6 shadow-sm">
        {loading && cachedImages.length === 0 ? (
          <p className="font-prata text-center text-[#5a5a5a] text-lg md:text-xl">
            Loading memories...
          </p>
        ) : images.length === 0 ? (
          <p className="font-prata text-center text-[#5a5a5a] text-lg md:text-xl px-4">
            No memories yet.
          </p>
        ) : (
          <div className="columns-2 sm:columns-3 lg:columns-4 gap-4 md:gap-5 space-y-4 md:space-y-5">
            {images.map((img, index) => (
              <div
                key={index}
                className="break-inside-avoid relative group cursor-pointer overflow-hidden rounded-xl"
                onClick={() => setFocusedIdx(index)}
              >
                <img
                  src={img}
                  alt={`Memory ${index + 1}`}
                  className="w-full rounded-xl shadow-md object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 rounded-xl bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              </div>
            ))}
          </div>
        )}
        </div>
      </section>

      {focusedIdx !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4"
          onClick={() => setFocusedIdx(null)}
        >
          <div
            className="relative max-w-5xl max-h-[90vh] flex items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setFocusedIdx((i) => (i - 1 + images.length) % images.length)}
              className="absolute -left-12 md:-left-16 bg-[#fdfbf7] border-2 border-[#691700] text-[#991D00] w-9 h-9 rounded-full flex items-center justify-center hover:bg-[#691700] hover:text-[#fdfbf7] transition-colors shadow-md cursor-pointer"
              aria-label="Previous photo"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <img
              src={images[focusedIdx]}
              className="max-w-full max-h-[90vh] rounded-xl shadow-2xl object-contain"
            />

            <button
              onClick={() => setFocusedIdx((i) => (i + 1) % images.length)}
              className="absolute -right-12 md:-right-16 bg-[#fdfbf7] border-2 border-[#691700] text-[#991D00] w-9 h-9 rounded-full flex items-center justify-center hover:bg-[#691700] hover:text-[#fdfbf7] transition-colors shadow-md cursor-pointer"
              aria-label="Next photo"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <button
              onClick={() => setFocusedIdx(null)}
              className="absolute -top-4 -right-4 bg-[#fdfbf7] border-2 border-[#691700] text-[#991D00] w-9 h-9 rounded-full flex items-center justify-center hover:bg-[#691700] hover:text-[#fdfbf7] transition-colors shadow-md text-lg font-bold cursor-pointer"
            >
              ✕
            </button>

            <p className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-white/60 text-sm font-medium tabular-nums">
              {focusedIdx + 1} / {images.length}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
