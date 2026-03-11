import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'



const NavBar = () => {
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
            className={`w-full py-2 md:py-3.5 px-3.25 sticky top-0 z-50 bg-gray-100 border-b border-[#691700] transition-transform duration-300 ${
                isVisible ? 'translate-y-0' : '-translate-y-full md:translate-y-0'
            }`}
        >
            <nav className="hidden md:flex justify-end items-center gap-2 pr-52">
                <Link 
                    to="/" 
                    className="px-3.25 py-1.75 font-prata border border-[#691700] rounded text-[#5a5a5a] hover:bg-[#E0462B] hover:text-white transition-all tracking-wide text-xs uppercase"
                >
                    Home
                </Link>
                
                <span className="text-[#991D00]">♥</span>
                
                <Link 
                    to="/journey" 
                    className="px-3.25 py-1.75 font-prata border border-[#691700] rounded text-[#5a5a5a] hover:bg-[#E0462B] hover:text-white transition-all tracking-wide text-xs uppercase"
                >
                    Our Journey
                </Link>
                
                <span className="text-[#991D00]">♥</span>

                <Link 
                    to="/gallery" 
                    className="px-3.25 py-1.75 font-prata border border-[#691700] rounded text-[#5a5a5a] hover:bg-[#E0462B] hover:text-white transition-all tracking-wide text-xs uppercase"
                >
                    Gallery
                </Link>

                <span className="text-[#991D00]">♥</span>

                <Link 
                    to="/lineup" 
                    className="px-3.25 py-1.75 font-prata border border-[#691700] rounded text-[#5a5a5a] hover:bg-[#E0462B] hover:text-white transition-all tracking-wide text-xs uppercase"
                >
                    Wedding Party Lineup
                </Link>

                <span className="text-[#991D00]">♥</span>

                <Link 
                    to="/wedding-logistics" 
                    className="px-3.25 py-1.75 font-prata border border-[#691700] rounded text-[#5a5a5a] hover:bg-[#E0462B] hover:text-white transition-all tracking-wide text-xs uppercase"
                >
                    Logistics
                </Link>

                {/* <span className="text-[#991D00]">♥</span>

                <Link 
                    to="/quiz" 
                    className="px-3.25 py-1.75 font-prata border border-[#691700] rounded text-[#5a5a5a] hover:bg-[#E0462B] hover:text-white transition-all tracking-wide text-xs uppercase"
                >
                    Take The Quiz
                </Link> */}

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
                <nav className="md:hidden mt-4 pb-2 flex flex-col items-center gap-1">
                    <Link 
                        to="/" 
                        onClick={() => setIsMenuOpen(false)}
                        className="w-full font-prata text-center px-3.25 py-1.75 border border-[#691700] rounded text-[#5a5a5a] hover:bg-[#E0462B] hover:text-white transition-all tracking-wide text-xs uppercase"
                    >
                        Home
                    </Link>

                    <span className="text-[#991D00]">♥</span>
                    
                    <Link 
                        to="/journey" 
                        onClick={() => setIsMenuOpen(false)}
                        className="w-full font-prata text-center px-3.25 py-1.75 border border-[#691700] rounded text-[#5a5a5a] hover:bg-[#E0462B] hover:text-white transition-all tracking-wide text-xs uppercase"
                    >
                        Our Journey
                    </Link>

                    <span className="text-[#991D00]">♥</span>

                    <Link 
                        to="/gallery" 
                        onClick={() => setIsMenuOpen(false)}
                        className="w-full font-prata text-center px-3.25 py-1.75 border border-[#691700] rounded text-[#5a5a5a] hover:bg-[#E0462B] hover:text-white transition-all tracking-wide text-xs uppercase"
                    >
                        Gallery
                    </Link>

                    <span className="text-[#991D00]">♥</span>

                    <Link 
                        to="/lineup" 
                        onClick={() => setIsMenuOpen(false)}
                        className="w-full font-prata text-center px-3.25 py-1.75 border border-[#691700] rounded text-[#5a5a5a] hover:bg-[#E0462B] hover:text-white transition-all tracking-wide text-xs uppercase"
                    >
                        Wedding Party Lineup
                    </Link>

                    <span className="text-[#991D00]">♥</span>

                    <Link 
                        to="/wedding-logistics" 
                        onClick={() => setIsMenuOpen(false)}
                        className="w-full font-prata text-center px-3.25 py-1.75 border border-[#691700] rounded text-[#5a5a5a] hover:bg-[#E0462B] hover:text-white transition-all tracking-wide text-xs uppercase"
                    >
                        Logistics
                    </Link>

                    {/* <span className="text-[#991D00]">♥</span>

                    <Link 
                        to="/quiz" 
                        onClick={() => setIsMenuOpen(false)}
                        className="w-full font-prata text-center px-3.25 py-1.75 border border-[#691700] rounded text-[#5a5a5a] hover:bg-[#E0462B] hover:text-white transition-all tracking-wide text-xs uppercase"
                    >
                        Take The Quiz
                    </Link> */}

                </nav>
            )}
        </header>
    )
}

export default NavBar;