import Countdown from 'react-countdown'
import ambikaSahil from "../assets/ambika-Sahil.png"
import "../App.css"
import saveTheDate from "../assets/saveTheDate.png"


const HomePage = () => {
    const date = new Date('2027-05-21T00:00:00-07:00');
    const renderer = ({ days, hours, minutes, seconds }) => {
        const years = Math.floor(days / 365);
        const adjustedDays = days - (365 * Math.floor(days / 365));
        return (
            <div className="flex justify-center gap-3 md:gap-4 mt-6">
                {days >= 365 ? 
                <>
                <div className="flex flex-col items-center">
                    <div className="bg-[#fdfbf7] border-2 border-[#691700] rounded-lg w-14 h-14 md:w-20 md:h-20 flex items-center justify-center shadow-md">
                        <span className="text-2xl md:text-3xl font-bold text-[#991D00]">{years}</span>
                    </div>
                    <span className="font-prata text-xs text-[#5a5a5a] mt-2 uppercase tracking-widest">Year</span>
                </div>
                <div className="flex flex-col items-center">
                    <div className="bg-[#fdfbf7] border-2 border-[#691700] rounded-lg w-14 h-14 md:w-20 md:h-20 flex items-center justify-center shadow-md">
                        <span className="text-2xl md:text-3xl font-bold text-[#991D00]">{adjustedDays}</span>
                    </div>
                    <span className="font-prata text-xs text-[#5a5a5a] mt-2 uppercase tracking-widest">Days</span>
                </div>
                </> : 
                <div className="flex flex-col items-center">
                    <div className="bg-[#fdfbf7] border-2 border-[#691700] rounded-lg w-14 h-14 md:w-20 md:h-20 flex items-center justify-center shadow-md">
                        <span className="text-2xl md:text-3xl font-bold text-[#991D00]">{days}</span>
                    </div>
                    <span className="font-prata text-xs text-[#5a5a5a] mt-2 uppercase tracking-widest">Days</span>
                </div>}
                
                <div className="flex flex-col items-center">
                    <div className="bg-[#fdfbf7] border-2 border-[#691700] rounded-lg w-14 h-14 md:w-20 md:h-20 flex items-center justify-center shadow-md">
                        <span className="text-2xl md:text-3xl font-bold text-[#991D00]">{hours}</span>
                    </div>
                    <span className="font-prata text-xs text-[#5a5a5a] mt-2 uppercase tracking-widest">Hours</span>
                </div>
                
                <div className="flex flex-col items-center">
                    <div className="bg-[#fdfbf7] border-2 border-[#691700] rounded-lg w-14 h-14 md:w-20 md:h-20 flex items-center justify-center shadow-md">
                        <span className="text-2xl md:text-3xl font-bold text-[#991D00]">{minutes}</span>
                    </div>
                    <span className="font-prata text-xs text-[#5a5a5a] mt-2 uppercase tracking-widest">Mins</span>
                </div>
                
                <div className="flex flex-col items-center">
                    <div className="bg-[#fdfbf7] border-2 border-[#691700] rounded-lg w-14 h-14 md:w-20 md:h-20 flex items-center justify-center shadow-md">
                        <span className="text-2xl md:text-3xl font-bold text-[#991D00]">{seconds}</span>
                    </div>
                    <span className="font-prata text-xs text-[#5a5a5a] mt-2 uppercase tracking-widest">Secs</span>
                </div>
            </div>
        )
    };
    
    return (
        <div className="justify-center min-h-screen bg-[#faf0e6]">
            <header className="pt-16 pb-8 text-center items-center justify-center px-4">
                <div className="flex justify-center mb-6">
                    <img 
                        src={ambikaSahil} 
                        alt="Ambika & Sahil"
                        className="w-full max-w-sm md:max-w-md h-auto object-contain"
                    />
                </div>
                <div className="flex items-center justify-center gap-4 mt-6">
                    <span className="h-px w-16 bg-[#691700]"></span>
                    <span className="text-[#991D00] text-2xl">♥</span>
                    <span className="h-px w-16 bg-[#691700]"></span>
                </div>
                <p className="font-prata mt-6 text-2xl md:text-3xl text-bold text-[#3B3B3B] tracking-wide">
                    May 2027
                </p>
                <Countdown date={date} renderer={renderer}/>
            </header>

            <div className="flex justify-center px-6 py-8">
                <div className="relative">
                    <div 
                    className="absolute inset-0 bg-[#691700] rounded-lg max-h-80 md:max-h-112 
                    transform rotate-3">                        
                    </div>
                    <img 
                        src={saveTheDate} 
                        alt="Sahil and Ambika's Engagement" 
                        className="relative rounded-lg shadow-xl max-w-md w-full max-h-80 md:max-h-112 object-contain"
                    />
                </div>
            </div>

            <section className="max-w-2xl md:max-w-3xl mx-auto px-4 py-6 text-center">
                <h2 className="font-prata text-4xl md:text-5xl text-[#4a4a4a] mb-2">Our Story</h2>
                <div className="flex items-center justify-center gap-3 mb-8">
                    <span className="h-px w-12 bg-[#691700]"></span>
                    <span className="text-[#991D00]">✦</span>
                    <span className="h-px w-12 bg-[#691700]"></span>
                </div>
                <p className="font-prata text-[#5a5a5a] leading-relaxed text-xl">
                    We met back in our senior year of high school through 
                    mutual friends, with Sahil asking Ambika to be his prom date. From that 
                    point we started to hang out more, started dating, and have been 
                    together since!
                </p>
                <p className="font-prata text-[#5a5a5a] leading-relaxed text-xl mt-6">
                    We both started at MSU <span className="text-[#7d8c7a] font-medium">(Go Green Go White!)</span> together 
                    for our undergrad, and Sahil transferred to UMich his junior 
                    year <span className="text-[#1c4e80] font-medium">(Go Blue!)</span>.
                </p>
                <p className="font-prata text-[#5a5a5a] leading-relaxed text-xl mt-6">
                    In June 2025, Sahil proposed to Ambika in Chicago, and we'll be 
                    getting married in May 2027!
                </p>
            </section>

            <div className="text-center pb-16">
                <span className="text-4xl text-[#991D00]">❧</span>
            </div>
        </div>
    )
}

export default HomePage;