import { useState, useRef, useEffect } from 'react';
import sadiGali from '../assets/sadi_gali.mp3';


const MusicPlayer = () => {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio(sadiGali);
    audioRef.current.loop = true;
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) {
      return;
    }
    playing ? audioRef.current.pause() : audioRef.current.play().catch(e => console.error(e));
    setPlaying(!playing);
  };

  return (
    <div className="flex items-center gap-3 px-5 py-2.5 text-[#5C2C1D]">
      <button 
        onClick={togglePlay}
        className="w-10 h-10 rounded-full bg-transparent border border-[#5C2C1D] cursor-pointer flex items-center justify-center transition-all duration-300 ease-in-out outline-none shadow-sm hover:shadow-md"
      >
        {playing ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#5C2C1D">
            <rect x="6" y="4" width="3" height="16" rx="1" />
            <rect x="15" y="4" width="3" height="16" rx="1" />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#5C2C1D" className="ml-0.5">
            <path d="M5 3l14 9-14 9V3z" />
          </svg>
        )}
      </button>
      <span className="text-xs tracking-[0.15em] uppercase font-prata opacity-80">
        {playing ? 'Pause Music' : 'Play Music'}
      </span>
    </div>
  );
};

export default MusicPlayer;