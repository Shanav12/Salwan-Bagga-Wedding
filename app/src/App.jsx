import './App.css'
import HomePage from "./components/Home"
import Journey from './components/Journey'
import NavBar from './components/NavBar'
import Gallery from './components/Gallery'
import MusicPlayer from './components/MusicPlayer'
import Lineup from './components/Lineup'
import GalleryProvider from "./contexts/GalleryProvider"
import { Routes, Route, HashRouter } from 'react-router-dom'
import WeddingLogistics from './components/WeddingLogistics'
import { useState, useEffect } from 'react'
import saveTheDate from "../src/assets/saveTheDate.png"


const App = () => {
  const [splashVisible, setSplashVisible] = useState(() => {
    return !sessionStorage.getItem('splashShown');
  });
  const [splashOpacity, setSplashOpacity] = useState(1);

  useEffect(() => {
      if (!splashVisible) {
        return;
      }
      sessionStorage.setItem('splashShown', 'true');
      const fadeTimer = setTimeout(() => setSplashOpacity(0), 2000);
      const removeTimer = setTimeout(() => setSplashVisible(false), 3000);
      return () => {
          clearTimeout(fadeTimer);
          clearTimeout(removeTimer);
      };
  }, []);

  return (
    <GalleryProvider>
      {splashVisible && (
          <div
              className="fixed inset-0 z-50 flex items-center justify-center px-6 py-8"
              style={{ 
                  transition: "opacity 1s ease-out", 
                  opacity: splashOpacity,
                  background: "radial-gradient(ellipse at center, #fdfbf7 0%, #f0dfd0 50%, #d4a882 100%)"}}>
              <img 
                  src={saveTheDate} 
                  className="h-96 md:h-128 rounded-lg object-cover shadow-2xl border-2 border-[#691700]" 
              />
          </div>
      )}
      <HashRouter>
        <NavBar />
        <div className="fixed top-1.5 right-6 z-50">
            <MusicPlayer />
        </div>
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/journey" element={<Journey />} />
            <Route path='/gallery' element={<Gallery />} />
            <Route path='/wedding-logistics' element={<WeddingLogistics />} />
            <Route path='/lineup' element={<Lineup />}/>
        </Routes>
      </HashRouter>
    </GalleryProvider>
  )
}

export default App;