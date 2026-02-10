import engagementPic from "../assets/sahilambika1.jpg"
import promPic from "../assets/sahilambika2.jpg"
import hsGradPic from "../assets/sahilambika3.jpg"
import sahilGradPic from "../assets/sahilambika4.jpg"
import ambikaWhiteCoatPic from "../assets/sahilambika5.jpg"
import firstDatePic from "../assets/sahilambika6.jpeg"
import gradPartyPic from "../assets/sahilambika7.jpg"
import lollaPic from "../assets/sahilambika8.jpg"
import firstAnniversaryPic from "../assets/sahilambika10.jpg"
import secondAnniversaryPic from "../assets/sahilambika11.jpg"
import freshmanHalloweenPic from "../assets/sahilambika12.jpg"
import juniorHalloweenPic from "../assets/sahilambika13.jpg"
import gamedayPic from "../assets/sahilambika14.jpg"
import ambuGradPic from "../assets/sahilambika15.jpg"
import proposalDecorPic from "../assets/sahilambika16.jpg"
import proposalCorkPic from "../assets/sahilambika17.jpg"
import rokaBackyardPic from "../assets/sahilambika18.jpg"
import proposalLedgePic from "../assets/sahilambika19.jpg"
import barcelonaPic from "../assets/sahilambika20.jpg"
import madridPic from "../assets/sahilambika21.jpg"
import florencePic from "../assets/sahilambika22.jpg"
import florenceViewPic from "../assets/sahilambika23.jpg"
import proposalChampagnePic from "../assets/sahilambika24.jpg"
import proposalDecorPosePic from "../assets/sahilambika25.jpg"
import proposalLedgePosePic from "../assets/sahilambika26.jpg"


let index = 0
const timelineEvents = [
    {
        title: "Chapter 1 - High School",
        events: [
            {
                image: promPic,
                date: "April 2019",
                title: "Prom Night",
                description: "Prom Night",
            },
            {
                image: firstDatePic,
                date: "May 2019",
                title: "First Date",
                description: "First Date",
            },
            {
                image: hsGradPic,
                date: "May 2019",
                title: "High School Graduation",
                description: "High School Grad",
            },
            {
                image: gradPartyPic,
                date: "June 2019",
                title: "Grad Party",
                description: "Grad Party",
            },
            {
                image: lollaPic,
                date: "August 2019",
                title: "Lollapalooza",
                description: "Lollapalooza",
            },
        ]
    },
    {
        title: "Chapter 2 - College",
        events: [
            {
                image: freshmanHalloweenPic,
                date: "October 2019",
                title: "College Freshman Halloween",
                description: "College Freshman Halloween",
            },
            {
                image: firstAnniversaryPic,
                date: "June 2020",
                title: "First Dating Anniversary",
                description: "First Dating Anniversary",
            },
            {
                image: secondAnniversaryPic,
                date: "June 2021",
                title: "Second Dating Anniversary",
                description: "Second Dating Anniversary",
            },
            {
                image: juniorHalloweenPic,
                date: "October 2020",
                title: "College Junior Halloween",
                description: "College Junior Halloween",
            },
            {
                image: gamedayPic,
                date: "November 2021",
                title: "Game Day",
                description: "Game Day",
            },
            {
                image: ambuGradPic,
                date: "May 2022",
                title: "Ambu Graduation",
                description: "Ambu Graduation",
            },
            {
                image: sahilGradPic,
                date: "May 2023",
                title: "Sahil Graduation",
                description: "Sahil Graduation",
            },
        ]
    },
    {
        title: "Chapter 3 - Engagement",
        events: [
            {
                image: proposalDecorPic,
                date: "June 2025",
                title: "Proposal",
                description: "Proposal",
            },
            {
                image: proposalChampagnePic,
                date: "June 2025",
                title: "Proposal Champagne",
                description: "Proposal Champagne",
            },
            {
                image: proposalCorkPic,
                date: "June 2025",
                title: "Proposal Cork",
                description: "Proposal Cork",
            },
            {
                image: proposalLedgePosePic,
                date: "June 2025",
                title: "Proposal Ledge Pose",
                description: "Proposal Ledge Pose",
            },
            {
                image: florencePic,
                date: "June 2025",
                title: "Florence",
                description: "Florence",
            },
            {
                image: rokaBackyardPic,
                date: "May 2019",
                title: "High School Graduation",
                description: "High School Grad",
            },
            {
                image: proposalLedgePic,
                date: "June 2025",
                title: "Proposal Ledge",
                description: "Proposal Ledge",
            },
            {
                image: proposalDecorPosePic,
                date: "June 2025",
                title: "Proposal Decor Pose",
                description: "Proposal Decor Pose",
            },
            {
                image: barcelonaPic,
                date: "July 2025",
                title: "Barcelona",
                description: "Barcelona",
            },
            {
                image: madridPic,
                date: "July 2025",
                title: "Madrid",
                description: "Madrid",
            },
            {
                image: florencePic,
                date: "July 2025",
                title: "Florence",
                description: "Florence",
            },
            {
                image: florenceViewPic,
                date: "July 2025",
                title: "Florence",
                description: "Florence",
            },
        ]
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

                {timelineEvents.map((chapter, chapterIndex) => {
                    return (
                        <>
                        <div key={chapterIndex} className={`mb-12 md:mb-16 flex items-center underline underline-offset-10 ${((chapterIndex % 2) === 0) ? 'justify-start' : 'justify-end'}`}>
                            <h2 className="text-3xl font-serif font-bold text-[#4a4a4a] mb-2">{chapter.title}</h2>
                        </div>
                        {
                        chapter.events.map((event, _) => {
                        const isLeft = (chapterIndex % 2) === 0
                        index += 1
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
                                                className="relative rounded-lg shadow-lg w-80 h-96 md:w-96 md:h-102 object-cover"
                                            />
                                        </div>
                                        <div className="mt-3 mb-3 font-serif ">
                                            <div className={`mt-3 text-left ${isLeft ? 'md:text-right' : 'md:text-left'}`}>
                                                <span className="inline-block px-3 py-1 bg-[#A32100] text-[#d4b896] rounded-full text-sm md:text-base font-medium tracking-wide">
                                                    {event.date}
                                                </span>
                                            </div>
                                            <h4 className="font-serif text-xl md:text-2xl text-[#4a4a4a] mt-2">
                                                {event.title}
                                            </h4>
                                            <div className="text-[#4a4a4a] mt-1 text-sm md:text-base"> 
                                                {event.description}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                        </>
                    )
                })}
            </div>
        </div>
    )
}


export default Journey;