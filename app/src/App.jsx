import './App.css'
import HomePage from "./components/HomePage"
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Journey from './components/Journey'
import FunFacts from './components/FunFacts'
import Header from './components/Header'


const App = () => {
  return (
    <BrowserRouter basename="/Salwan-Bagga-Wedding">
        <Header />
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/journey" element={<Journey />} />
            <Route path="/fun-facts" element={<FunFacts />} />
        </Routes>
    </BrowserRouter>
  )
}

export default App;