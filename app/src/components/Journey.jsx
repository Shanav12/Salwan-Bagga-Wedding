import pic1 from "../assets/sahilambika1.jpg"
import pic2 from "../assets/sahilambika2.jpg"
import pic3 from "../assets/sahilambika3.jpg"



const timelineEvents = [
    {
        image: pic2,
        date: "April 2019",
        title: "Prom Night",
    },
    {
        image: pic3,
        date: "May 2019",
        title: "High School Graduation",
    },
    {
        image: pic2,
        date: "August 2019",
        title: "Off to MSU Together",
    },
    {
        image: pic2,
        date: "December 2021",
        title: "Ambika Graduates From MSU",
    },
    {
        image: pic3,
        date: "May 2023",
        title: "Sahil Graduates From UMich",
    },
    {
        image: pic3,
        date: "July 2023",
        title: "Sahil moves to NYC and starts work at Google",
    },
    {
        image: pic3,
        date: "August 2023",
        title: "Ambika's White Coat Ceremony",
    },
    {
        image: pic1,
        date: "June 2025",
        title: "The Proposal",
    }
]



const Journey = () => {
    return (
        <div className="min-h-full bg-gradient-to-b from-rose-50 to-cream-50 bg-[#fdfbf7] py-16 px-4 overflow-x-hidden">
            <div className="text-center mb-16">
                <h1 className="font-serif text-5xl text-[#4a4a4a] mb-4">Their Journey</h1>
                <div className="flex items-center justify-center gap-4">
                    <span className="h-px w-16 bg-[#d4b896]"></span>
                    <span className="text-[#d4b896] text-2xl">♥</span>
                    <span className="h-px w-16 bg-[#d4b896]"></span>
                </div>
            </div>

            <div className="max-w-4xl mx-auto relative">
                <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-[#e8d4d4]"></div>

                {timelineEvents.map((event, index) => {
                    const isLeft = index % 2 === 0
                    return (
                        <div
                            key={index}
                            className={`relative flex items-center ${isLeft ? 'justify-start' : 'justify-end'}`}
                        >
                            <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-[#d4b896] rounded-full border-4 border-[#fdfbf7] z-10"></div>
                            <div
                                className={`w-[45%] ${isLeft ? 'pr-8 text-right' : 'pl-8 text-left'}`}
                            >
                                <div className={`relative inline-block ${isLeft ? 'ml-auto' : 'mr-auto'}`}>
                                    <div className="absolute inset-0 bg-[#d4b896] rounded-lg transform rotate-2"></div>
                                    <img
                                        src={event.image}
                                        alt={event.title}
                                        className="relative rounded-lg shadow-lg w-72 h-56 object-cover"
                                    />
                                </div>
                                <div className={`mt-3 ${isLeft ? 'text-right' : 'text-left'}`}>
                                    <span className="inline-block px-3 py-1 bg-[#f8e8e8] text-[#d4b896] rounded-full text-xs font-medium tracking-wide">
                                        {event.date}
                                    </span>
                                </div>
                                <h3 className="font-serif text-xl text-[#4a4a4a] mt-2">
                                    {event.title}
                                </h3>
                                {/* <p className="text-[#5a5a5a] mt-1 text-sm leading-relaxed">
                                    {event.description}
                                </p> */}
                            </div>
                        </div>
                    )
                })}

                {/* End heart */}
                <div className="flex justify-center pt-8">
                    <span className="text-4xl text-[#d4b896]">♥</span>
                </div>
            </div>
        </div>
    )
}


export default Journey;