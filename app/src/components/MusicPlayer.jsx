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
    if (!audioRef.current) return;
    playing ? audioRef.current.pause() : audioRef.current.play().catch(e => console.error(e));
    setPlaying(!playing);
  };

  return (
    <div style={styles.wrapper}>
      <button onClick={togglePlay} style={styles.button}>
        {playing ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#5C2C1D">
            <rect x="6" y="4" width="3" height="16" rx="1" />
            <rect x="15" y="4" width="3" height="16" rx="1" />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#5C2C1D" style={{ marginLeft: '2px' }}>
            <path d="M5 3l14 9-14 9V3z" />
          </svg>
        )}
      </button>
      <span style={styles.text}>{playing ? 'Pause Music' : 'Play Music'}</span>
    </div>
  );
};

const styles = {
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 20px',
    // Use the exact deep brown/burgundy from your "Sahil & Ambika" text
    color: '#5C2C1D', 
  },
  button: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: 'transparent',
    // Border matches the countdown box outlines
    border: '1px solid #5C2C1D', 
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    outline: 'none',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  },
  text: {
    fontSize: '12px',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    // Matching the font style of your "YEAR", "DAYS" labels
    fontFamily: 'serif', 
    opacity: 0.8,
  }
};

export default MusicPlayer;