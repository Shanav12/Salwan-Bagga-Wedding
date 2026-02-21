import './App.css'
import HomePage from "./components/Home"
import Journey from './components/Journey'
import FunFacts from './components/FunFacts'
import NavBar from './components/NavBar'
import Gallery from './components/Gallery'
import { GalleryProvider } from "./contexts/GalleryContext"
import { Routes, Route, HashRouter } from 'react-router-dom'
import WeddingLogistics from './components/WeddingLogistics'


const App = () => {
  return (
    <GalleryProvider>
      <HashRouter>
          <NavBar />
          <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/journey" element={<Journey />} />
              <Route path="/fun-facts" element={<FunFacts />} />
              <Route path='/gallery' element={<Gallery />} />
              <Route path='/wedding-logistics' element={<WeddingLogistics/>} />
          </Routes>
      </HashRouter>
    </GalleryProvider>
  )
}

export default App;