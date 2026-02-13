import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import MusicPlayer from './MusicPlayer'


const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isVisible, setIsVisible] = useState(true)
    const [lastScrollY, setLastScrollY] = useState(0)


    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY
            
            if (currentScrollY > lastScrollY && currentScrollY > 25) {
                setIsVisible(false)
                setIsMenuOpen(false)
            } else {
                setIsVisible(true)
            }
            
            setLastScrollY(currentScrollY)
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
    }, [lastScrollY])


    return (
        <header 
            className={`w-full py-3 px-4 md:px-6 sticky top-0 z-50 bg-gray-100 border-b border-[#691700] transition-transform duration-300 ${
                isVisible ? 'translate-y-0' : '-translate-y-full md:translate-y-0'
            }`}
        >
            <nav className="hidden md:flex justify-end items-center gap-4">
                <Link 
                    to="/" 
                    className="px-4 py-2 border border-[#691700] rounded text-[#5a5a5a] hover:bg-[#E0462B] hover:text-white transition-all tracking-wide text-sm uppercase"
                >
                    Home
                </Link>
                
                <span className="text-[#991D00]">♥</span>
                
                <Link 
                    to="/journey" 
                    className="px-4 py-2 border border-[#691700] rounded text-[#5a5a5a] hover:bg-[#E0462B] hover:text-white transition-all tracking-wide text-sm uppercase"
                >
                    Our Journey
                </Link>
                
                <span className="text-[#991D00]">♥</span>
{/*                 
                <Link 
                    to="/fun-facts" 
                    className="px-4 py-2 border border-[#691700] rounded text-[#5a5a5a] hover:bg-[#E0462B] hover:text-white transition-all tracking-wide text-sm uppercase"
                >
                    Fun Facts
                </Link>

                <span className="text-[#991D00]">♥</span> */}

                <Link 
                    to="/gallery" 
                    className="px-4 py-2 border border-[#border-[#691700]] rounded text-[#5a5a5a] hover:bg-[#E0462B] hover:text-white transition-all tracking-wide text-sm uppercase"
                >
                    Gallery
                </Link>
                <MusicPlayer></MusicPlayer>
            </nav>

            <div className="md:hidden flex justify-between items-center">                
                <button 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="p-2 text-[#5a5a5a] focus:outline-none"
                    aria-label="Toggle menu"
                >
                    {isMenuOpen ? (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    )}
                </button>
            </div>

            {isMenuOpen && (
                <nav className="md:hidden mt-4 pb-2 flex flex-col items-center gap-3">
                    <Link 
                        to="/" 
                        onClick={() => setIsMenuOpen(false)}
                        className="w-full text-center px-4 py-2 border border-[#691700] rounded text-[#5a5a5a] hover:bg-[#E0462B] hover:text-white transition-all tracking-wide text-sm uppercase"
                    >
                        Home
                    </Link>

                    <span className="text-[#991D00]">♥</span>
                    
                    <Link 
                        to="/journey" 
                        onClick={() => setIsMenuOpen(false)}
                        className="w-full text-center px-4 py-2 border border-[#691700] rounded text-[#5a5a5a] hover:bg-[#E0462B] hover:text-white transition-all tracking-wide text-sm uppercase"
                    >
                        Our Journey
                    </Link>

                    <span className="text-[#991D00]">♥</span>
                    
                    {/* <Link 
                        to="/fun-facts" 
                        onClick={() => setIsMenuOpen(false)}
                        className="w-full text-center px-4 py-2 border border-[#691700] rounded text-[#5a5a5a] hover:bg-[#E0462B] hover:text-white transition-all tracking-wide text-sm uppercase"
                    >
                        Fun Facts
                    </Link>

                    <span className="text-[#991D00]">♥</span> */}

                    <Link 
                        to="/gallery" 
                        onClick={() => setIsMenuOpen(false)}
                        className="w-full text-center px-4 py-2 border border-[#691700] rounded text-[#5a5a5a] hover:bg-[#E0462B] hover:text-white transition-all tracking-wide text-sm uppercase"
                    >
                        Gallery
                    </Link>
                    <MusicPlayer></MusicPlayer>
                </nav>
            )}
        </header>
    )
}

export default Header