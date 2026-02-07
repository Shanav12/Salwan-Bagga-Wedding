import './App.css'
import HomePage from "./components/Home"
import Journey from './components/Journey'
import FunFacts from './components/FunFacts'
import Header from './components/NavBar'
import { Routes, Route, HashRouter } from 'react-router-dom'


const App = () => {
  return (
    <HashRouter>
        <Header />
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/journey" element={<Journey />} />
            <Route path="/fun-facts" element={<FunFacts />} />
        </Routes>
    </HashRouter>
  )
}

export default App;