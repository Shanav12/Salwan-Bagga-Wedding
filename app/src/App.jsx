import './App.css'
import HomePage from "./components/Home"
import Journey from './components/Journey'
import FunFacts from './components/FunFacts'
import Header from './components/NavBar'
import Gallery from './components/Gallery'
import { GalleryProvider } from "./contexts/GalleryContext"
import { Routes, Route, HashRouter } from 'react-router-dom'



const App = () => {
  return (
    <GalleryProvider>
      <HashRouter>
          <Header />
          <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/journey" element={<Journey />} />
              <Route path="/fun-facts" element={<FunFacts />} />
              <Route path='/gallery' element={<Gallery />} />
          </Routes>
      </HashRouter>
    </GalleryProvider>
  )
}

export default App;