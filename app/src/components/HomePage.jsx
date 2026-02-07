import engagementPic from "../assets/sahilambika1.jpg"
import Countdown from 'react-countdown'



const HomePage = () => {
    const date = new Date(2027, 5, 21);
    const renderer = ({ days, hours, minutes, seconds }) => {
        return (
            <div className="flex justify-center gap-3 md:gap-4 mt-6">
                <div className="flex flex-col items-center">
                    <div className="bg-[#fdfbf7] border-2 border-[#d4b896] rounded-lg w-16 h-16 md:w-20 md:h-20 flex items-center justify-center shadow-md">
                        <span className="text-2xl md:text-3xl font-bold text-[#d4b896]">{days}</span>
                    </div>
                    <span className="text-xs text-[#5a5a5a] mt-2 uppercase tracking-widest">Days</span>
                </div>
                
                <div className="flex flex-col items-center">
                    <div className="bg-[#fdfbf7] border-2 border-[#d4b896] rounded-lg w-16 h-16 md:w-20 md:h-20 flex items-center justify-center shadow-md">
                        <span className="text-2xl md:text-3xl font-bold text-[#d4b896]">{hours}</span>
                    </div>
                    <span className="text-xs text-[#5a5a5a] mt-2 uppercase tracking-widest">Hours</span>
                </div>
                
                <div className="flex flex-col items-center">
                    <div className="bg-[#fdfbf7] border-2 border-[#d4b896] rounded-lg w-16 h-16 md:w-20 md:h-20 flex items-center justify-center shadow-md">
                        <span className="text-2xl md:text-3xl font-bold text-[#d4b896]">{minutes}</span>
                    </div>
                    <span className="text-xs text-[#5a5a5a] mt-2 uppercase tracking-widest">Mins</span>
                </div>
                
                <div className="flex flex-col items-center">
                    <div className="bg-[#fdfbf7] border-2 border-[#d4b896] rounded-lg w-16 h-16 md:w-20 md:h-20 flex items-center justify-center shadow-md">
                        <span className="text-2xl md:text-3xl font-bold text-[#d4b896]">{seconds}</span>
                    </div>
                    <span className="text-xs text-[#5a5a5a] mt-2 uppercase tracking-widest">Secs</span>
                </div>
            </div>
        )
    };
    return (
        <div className="justify-center min-h-screen bg-gradient-to-b from-rose-50 to-cream-50 bg-[#fdfbf7]">
            <header className="pt-16 pb-8 text-center items-center justify-center">
                <h1 className="font-serif text-5xl md:text-6xl text-[#3B3B3B] mb-2">
                    Sahil & Ambika
                </h1>
                <div className="flex items-center justify-center gap-4 mt-6">
                    <span className="h-px w-16 bg-[#d4b896]"></span>
                    <span className="text-[#d4b896] text-2xl">♥</span>
                    <span className="h-px w-16 bg-[#d4b896]"></span>
                </div>
                <p className="mt-6 text-2xl text-bold text-[#3B3B3B] tracking-wide">
                    May 2027
                </p>
                <Countdown date={date} renderer={renderer}/>
            </header>

            <div className="flex justify-center px-6 py-8">
                <div className="relative">
                    <div className="absolute inset-0 bg-[#d4b896] rounded-lg transform rotate-3"></div>
                    <img 
                        src={engagementPic} 
                        alt="Sahil and Ambika's Engagement" 
                        className="relative rounded-lg shadow-xl max-w-md w-full object-cover"
                    />
                </div>
            </div>

            <section className="max-w-2xl mx-auto px-8 py-12 text-center">
                <h2 className="font-serif text-4xl text-[#4a4a4a] mb-2">Our Story</h2>
                <div className="flex items-center justify-center gap-3 mb-8">
                    <span className="h-px w-12 bg-[#e8d4d4]"></span>
                    <span className="text-[#d4b896]">✦</span>
                    <span className="h-px w-12 bg-[#e8d4d4]"></span>
                </div>
                <p className="text-[#5a5a5a] leading-relaxed text-lg">
                    We met back in our senior year of high school through 
                    mutual friends, with Sahil asking Ambika to be his prom date. From that 
                    point we started to hang out more, started dating, and have been 
                    together since!
                </p>
                <p className="text-[#5a5a5a] leading-relaxed text-lg mt-6">
                    We both went to MSU <span className="text-[#7d8c7a] font-medium">(Go Green Go White!)</span> together 
                    for our undergrad, and Sahil transferred to UMich his junior 
                    year <span className="text-[#1c4e80] font-medium">(Go Blue!)</span>.
                </p>
                <p className="text-[#5a5a5a] leading-relaxed text-lg mt-6">
                    In June 2025, Sahil proposed to Ambika in Chicago, and we'll be 
                    getting married in May 2027!
                </p>
            </section>

            <div className="text-center pb-16">
                <span className="text-4xl text-[#e8d4d4]">❧</span>
            </div>
        </div>
    )
}

export default HomePage;