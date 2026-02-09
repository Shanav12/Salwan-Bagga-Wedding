import engagementPic from "../assets/sahilambika1.jpg"
import promPic from "../assets/sahilambika2.jpg"
import hsGradPic from "../assets/sahilambika3.jpg"
import sahilGradPic from "../assets/sahilambika4.jpg"
import ambikaWhiteCoatPic from "../assets/sahilambika5.jpg"


const timelineEvents = [
    {
        image: promPic,
        date: "April 2019",
        title: "Prom Night",
    },
    {
        image: hsGradPic,
        date: "May 2019",
        title: "High School Graduation",
    },
    {
        image: promPic,
        date: "August 2019",
        title: "Off to MSU Together",
    },
    {
        image: hsGradPic,
        date: "December 2021",
        title: "Ambika Graduates From MSU",
    },
    {
        image: sahilGradPic,
        date: "May 2023",
        title: "Sahil Graduates From UMich",
    },
    {
        image: hsGradPic,
        date: "July 2023",
        title: "Sahil moves to NYC and starts at Google",
    },
    {
        image: ambikaWhiteCoatPic,
        date: "August 2023",
        title: "Ambika's White Coat Ceremony",
    },
    {
        image: engagementPic,
        date: "June 2025",
        title: "The Engagement",
    }
]



const Journey = () => {
    return (
        <div className="min-h-full bg-[#faf0e6] py-16 px-4 overflow-x-hidden">
            <div className="text-center mb-16">
                <h1 className="font-serif text-5xl md:text-7xl text-[#4a4a4a] mb-4">Our Journey</h1>
                <div className="flex items-center justify-center gap-4">
                    <span className="h-px w-12 md:w-16 bg-[#691700]"></span>
                    <span className="text-[#991D00] text-2xl md:text-3xl">♥</span>
                    <span className="h-px w-12 md:w-16 bg-[#691700]"></span>
                </div>
            </div>

            <div className="max-w-4xl mx-auto relative">
                <div className="absolute left-4 md:left-1/2 md:transform md:-translate-x-1/2 h-full w-0.5 bg-[#691700]"></div>

                {timelineEvents.map((event, index) => {
                    const isLeft = index % 2 === 0
                    return (
                        <div
                            key={index}
                            className={`relative flex items-center mb-12 md:mb-0 justify-start md:${isLeft ? 'justify-start' : 'justify-end'}`}
                        >
                            <div className="absolute left-4 md:left-1/2 transform -translate-x-1/2 w-4 h-4 md:w-5 md:h-5 bg-[#991D00] rounded-full border-4 border-[#fdfbf7] z-10"></div>
                            <div
                                className={`ml-12 md:ml-0 md:w-[45%] text-left ${
                                    isLeft 
                                        ? 'md:pr-8 md:text-right' 
                                        : 'md:pl-8 md:text-left md:ml-auto'
                                }`}
                            >
                                <div className={`relative inline-block ${isLeft ? 'md:ml-auto' : 'md:mr-auto'}`}>
                                    <div className="absolute inset-0 bg-[#691700] rounded-lg transform rotate-2"></div>
                                    <img
                                        src={event.image}
                                        alt={event.title}
                                        className="relative rounded-lg shadow-lg w-64 h-48 md:w-96 md:h-72 object-cover"
                                    />
                                </div>
                                <div className={`mt-3 text-left ${isLeft ? 'md:text-right' : 'md:text-left'}`}>
                                    <span className="inline-block px-3 py-1 bg-[#A32100] text-[#d4b896] rounded-full text-sm md:text-base font-medium tracking-wide">
                                        {event.date}
                                    </span>
                                </div>
                                <h3 className="font-serif text-xl md:text-3xl text-[#4a4a4a] mt-2">
                                    {event.title}
                                </h3>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}


export default Journey;