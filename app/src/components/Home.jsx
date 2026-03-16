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
                    <div className="bg-[#fdfbf7] border-2 border-[#691700] rounded-lg w-14 h-14 md:w-18 md:h-18 flex items-center justify-center shadow-md">
                        <span className="text-2xl md:text-3xl font-bold text-[#991D00]">{years}</span>
                    </div>
                    <span className="font-prata text-xs text-[#5a5a5a] mt-2 uppercase tracking-widest">Year</span>
                </div>
                <div className="flex flex-col items-center">
                    <div className="bg-[#fdfbf7] border-2 border-[#691700] rounded-lg w-14 h-14 md:w-18 md:h-18 flex items-center justify-center shadow-md">
                        <span className="text-2xl md:text-3xl font-bold text-[#991D00]">{adjustedDays}</span>
                    </div>
                    <span className="font-prata text-xs text-[#5a5a5a] mt-2 uppercase tracking-widest">Days</span>
                </div>
                </> : 
                <div className="flex flex-col items-center">
                    <div className="bg-[#fdfbf7] border-2 border-[#691700] rounded-lg w-14 h-14 md:w-18 md:h-18 flex items-center justify-center shadow-md">
                        <span className="text-2xl md:text-3xl font-bold text-[#991D00]">{days}</span>
                    </div>
                    <span className="font-prata text-xs text-[#5a5a5a] mt-2 uppercase tracking-widest">Days</span>
                </div>}
                
                <div className="flex flex-col items-center">
                    <div className="bg-[#fdfbf7] border-2 border-[#691700] rounded-lg w-14 h-14 md:w-18 md:h-18 flex items-center justify-center shadow-md">
                        <span className="text-2xl md:text-3xl font-bold text-[#991D00]">{hours}</span>
                    </div>
                    <span className="font-prata text-xs text-[#5a5a5a] mt-2 uppercase tracking-widest">Hours</span>
                </div>
                
                <div className="flex flex-col items-center">
                    <div className="bg-[#fdfbf7] border-2 border-[#691700] rounded-lg w-14 h-14 md:w-18 md:h-18 flex items-center justify-center shadow-md">
                        <span className="text-2xl md:text-3xl font-bold text-[#991D00]">{minutes}</span>
                    </div>
                    <span className="font-prata text-xs text-[#5a5a5a] mt-2 uppercase tracking-widest">Mins</span>
                </div>
                
                <div className="flex flex-col items-center">
                    <div className="bg-[#fdfbf7] border-2 border-[#691700] rounded-lg w-14 h-14 md:w-18 md:h-18 flex items-center justify-center shadow-md">
                        <span className="text-2xl md:text-3xl font-bold text-[#991D00]">{seconds}</span>
                    </div>
                    <span className="font-prata text-xs text-[#5a5a5a] mt-2 uppercase tracking-widest">Secs</span>
                </div>
            </div>
        )
    };

    return (
        <div className="justify-center min-h-screen bg-[#faf0e6]">
            <header className="pt-8 pb-8 text-center items-center justify-center px-4">
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

            <div className="flex justify-center px-6 py-2 md:py-4">
                <div className="relative">
                    <div className="absolute inset-0 bg-[#691700] rounded-lg transform rotate-3"></div>
                    <img
                        src={saveTheDate}
                        alt="Sahil and Ambika's Engagement"
                        className="relative rounded-lg shadow-xl w-72 h-96 md:w-80 md:h-112 object-cover"
                    />
                </div>
            </div>

            <section className="max-w-2xl md:max-w-3xl mx-auto px-4 py-6 text-center">
                <h2 className="font-prata text-4xl md:text-5xl text-[#4a4a4a] mb-2">Our Story</h2>
                <div className="flex items-center justify-center gap-3 mb-6">
                    <span className="h-px w-12 bg-[#691700]"></span>
                    <span className="text-[#991D00]">✦</span>
                    <span className="h-px w-12 bg-[#691700]"></span>
                </div>
                <p className="font-prata text-[#5a5a5a] leading-relaxed text-md md:text-lg">
                    We met at eighteen, before careers and before adulthood really made sense, and somehow life kept choosing us for each other. We’ve grown up side by side, learning who we are while learning how to love one another. From late-night drives and simple dates to big milestones and new cities, every season has shaped our story.
                </p>
                <p className="font-prata text-[#5a5a5a] leading-relaxed text-md md:text-lg mt-6">
                    Our journey hasn’t been perfect or easy. We’ve celebrated incredible highs and also stood together through moments of real loss and challenge. For years, we navigated long distance between Detroit and New York, planning weekends around flight schedules, late-night airport pickups, and quick trips that never felt long enough. We learned how to make ordinary moments special and how much effort love is worth. Those years taught us patience, trust, and that home was never a place, but each other.
                </p>
                <p className="font-prata text-[#5a5a5a] leading-relaxed text-md md:text-lg mt-6">
                    Chicago has always felt like a midpoint in our story, a city that sits between Detroit and New York and somehow feels like home to us both. It was only fitting that Sahil proposed at the London House rooftop, overlooking the skyline and the river below. In a place that represents so many shared memories and in-between chapters, we chose forever.
                </p>
                <p className="font-prata text-[#5a5a5a] leading-relaxed text-md md:text-lg mt-6">
                    We are deeply grateful for the family and friends who have supported, encouraged, and loved us along the way. You have watched us grow from teenagers into the people standing here today, and your presence in our lives means more than we can say.
                </p>
                 <p className="font-prata text-[#5a5a5a] leading-relaxed text-md md:text-lg mt-6">
                   We feel incredibly lucky to have found each other so early and even luckier to still choose each other every day. We cannot wait to celebrate our love, our memories, and the beginning of our next chapter with all of you. Now, let’s get ready to party!
                </p>
            </section>

            <div className="text-center pb-16">
                <span className="text-4xl text-[#991D00]">❧</span>
            </div>
        </div>
    )
}

export default HomePage;