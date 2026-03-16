import { useState, useRef, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import EoO from "../assets/EoO.mp3";
import teriOre from "../assets/teri_ore.mp3";
import headlines from "../assets/drake_headlines.mp3";
import dieForYou from "../assets/die_for_you_weeknd.mp3";
import jeopardyThemeSong from "../assets/jeopardyThemeSong.mp3"
import wiiThemeSong from "../assets/wiiThemeSong.mp3"


const MusicPlayer = ({showPlay, setShowPlay}) => {
  const [playing, setPlaying] = useState(false);
  const [currIdx, setCurrIdx] = useState(0);
  const audioRef = useRef(null);
  const location = useLocation();
  const songs = useMemo(() => [teriOre, dieForYou, headlines, EoO, jeopardyThemeSong, wiiThemeSong], []);

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
    if (!audioRef.current) return;
    const audio = audioRef.current;
    const isQuiz = location.pathname === '/quiz';
    audio.pause(); 
    audio.src = songs[currIdx];
    audio.loop = !isQuiz;
    audio.load();
    let cleanup = () => {};
    if (isQuiz) {
      const handleEnded = () => {
        setCurrIdx(prev => (prev === 4 ? 5 : 4));
      };
      audio.addEventListener('ended', handleEnded);
      cleanup = () => audio.removeEventListener('ended', handleEnded);
    }
    if (playing) {
      audio.play().catch(console.error);
    }
    return cleanup;
  }, [currIdx, location.pathname, playing]);


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
    if (location.pathname === '/') {
      setPlaying(false);
      setShowPlay(false)
    } else {
      setShowPlay(true)
    }
    if (location.pathname === '/journey') {
      setCurrIdx(0);
      setPlaying(true);
    }
    if (location.pathname === '/gallery') {
      setCurrIdx(1);
      setPlaying(true);
    }
    if (location.pathname === '/lineup') {
      setCurrIdx(2);
      setPlaying(true);
    }
    if (location.pathname === '/wedding-logistics') {
      setCurrIdx(3);
      setPlaying(true);
    }
    if (location.pathname === '/quiz') {
      setCurrIdx(4)
      setPlaying(true);
    }
  }, [location.pathname, songs]);


  return (
    <div className="flex items-center gap-3 px-5 py-2.5 text-[#5C2C1D]">
      {showPlay && 
      <>
        <button
          onClick={() => setPlaying(p => !p)}
          className="w-8 h-8 rounded-full border border-[#5C2C1D] flex items-center justify-center"
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
      </>}
    </div>
  );
};

export default MusicPlayer;