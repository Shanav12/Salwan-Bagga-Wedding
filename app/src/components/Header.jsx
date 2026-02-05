import { Link } from 'react-router-dom'

const Header = () => {
    return (
        <header className="w-full py-4 px-6 sticky top-0 z-50 bg-[#fce4ec]">
            <nav className="flex justify-end items-center gap-4">
                <Link 
                    to="/" 
                    className="px-4 py-2 border border-[#d4b896] rounded text-[#5a5a5a] hover:bg-[#d4b896] hover:text-white transition-all tracking-wide text-sm uppercase"
                >
                    Home
                </Link>
                
                <span className="text-[#d4b896]">♥</span>
                
                <Link 
                    to="/journey" 
                    className="px-4 py-2 border border-[#d4b896] rounded text-[#5a5a5a] hover:bg-[#d4b896] hover:text-white transition-all tracking-wide text-sm uppercase"
                >
                    Their Journey
                </Link>
                
                <span className="text-[#d4b896]">♥</span>
                
                <Link 
                    to="/fun-facts" 
                    className="px-4 py-2 border border-[#d4b896] rounded text-[#5a5a5a] hover:bg-[#d4b896] hover:text-white transition-all tracking-wide text-sm uppercase"
                >
                    Fun Facts
                </Link>
            </nav>
        </header>
    )
}

export default Header