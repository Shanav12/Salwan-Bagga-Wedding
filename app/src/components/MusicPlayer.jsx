import { useState, useRef, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import sadiGali from '../assets/sadi_gali.mp3';
import EoO from "../assets/EoO.mp3";



const MusicPlayer = () => {
  const [playing, setPlaying] = useState(false);
  const [currIdx, setCurrIdx] = useState(0);
  const audioRef = useRef(null);
  const location = useLocation();
  const songs = useMemo(() => [sadiGali, EoO], []);

  useEffect(() => {
    audioRef.current = new Audio(songs[currIdx]);
    audioRef.current.loop = true;
    return () => {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;
    };
  }, []);


  useEffect(() => {
    if (!audioRef.current) {
      return;
    }
    const audio = audioRef.current;
    const wasPlaying = !audio.paused;
    audio.pause();
    audio.src = songs[currIdx];
    audio.load();
    if (wasPlaying) {
      audio.play().catch(console.error);
    }
  }, [currIdx]);


  useEffect(() => {
    if (!audioRef.current) {
      return;
    }
    if (playing) {
      audioRef.current.play().catch(() => setPlaying(false));
    } else {
      audioRef.current.pause();
    }
  }, [playing]);


  useEffect(() => {
    if (location.pathname === '/wedding-logistics') {
      setCurrIdx(songs.length - 1);
      setPlaying(true);
    }
  }, [location.pathname, songs]);


  return (
    <div className="flex items-center gap-3 px-5 py-2.5 text-[#5C2C1D]">
      <button
        onClick={() => setPlaying(p => !p)}
        className="w-10 h-10 rounded-full border border-[#5C2C1D] flex items-center justify-center"
      >
        {playing ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="4" width="3" height="16" />
            <rect x="15" y="4" width="3" height="16" />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
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