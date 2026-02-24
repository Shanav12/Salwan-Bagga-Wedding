import promposalPic from "../assets/sahilambika0.jpg"
import promPic from "../assets/sahilambika2.jpg"
import hsGradPic from "../assets/sahilambika3.jpg"
import sahilGradPic from "../assets/sahilambika4.jpg"
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
import rokaBackyardPic from "../assets/sahilambika18.jpg"
import barcelonaPic from "../assets/sahilambika20.jpg"
import madridPic from "../assets/sahilambika21.jpg"
import florencePic from "../assets/sahilambika22.jpg"
import proposalChampagnePic from "../assets/sahilambika24.jpg"
import proposalLedgePosePic from "../assets/sahilambika26.jpg"
import engagementPartyPic from "../assets/sahilambika28.jpg"


let index = 0
const timelineEvents = [
    {
        title: "Chapter 1 - High School",
        events: [
            {
                image: promposalPic,
                date: "April 2019",
                title: "Promposal!",
                description: "With a feeling of butterflies and excitement, Sahil mustered up the courage to ask Ambika to senior prom! The begining of our journey together :)",
            },
            {
                image: promPic,
                date: "April 2019",
                title: "Prom Night",
                description: "After endless waiting, the big night finally arrived! Our first nice outing together, we arrvied in style in a pickup truck Uber.",
            },
            {
                image: firstDatePic,
                date: "May 2019",
                title: "First Date",
                description: "Date night! Bowling, flatbread, hot cocoa, and a light rainy drizzle. Almost out of a Hollywood movie. ",
            },
            {
                image: hsGradPic,
                date: "May 2019",
                title: "High School Graduation",
                description: "Graduation day! Even though this day was the end of a long high school journey, it marked the start of a new chapter in our lives together",
            },
            {
                image: gradPartyPic,
                date: "June 2019",
                title: "Grad Party",
                description: "Backyard grad party! Sahil got to introduce Ambika to his family and friends, celebrating a new academic and romantic chapter in our lives together",
            },
            {
                image: lollaPic,
                date: "August 2019",
                title: "Lollapalooza",
                description: "Chicago summer! We got to experience our first big festivial together, dancing and singing along to our favorite artists in the best city in the world!",
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
                description: "First Halloween in college! Cowboy and cowgirl inspired costumes for a night of endless fun and memories.",
            },
            {
                image: firstAnniversaryPic,
                date: "June 2020",
                title: "First Dating Anniversary",
                description: "Already one year together! We took advantage of the summer weather and biked along the Chicago lakefront, enjoying the sunshine, skyline, and each other's company.",
            },
            {
                image: secondAnniversaryPic,
                date: "June 2021",
                title: "Second Dating Anniversary",
                description: "Forward a year and onto our second anniversary! This time we went back to our Chicago roots and did a pizza tour in the city across the best pizzerias in the city.",
            },
            {
                image: juniorHalloweenPic,
                date: "October 2021",
                title: "College Junior Halloween",
                description: "A classic but mandatory couple's Halloween costume, Jasmine and Aladdin! We had a blast partying as the iconic Disney duo.",
            },
            {
                image: gamedayPic,
                date: "November 2021",
                title: "Game Day",
                description: "Go Blue! Go Green! Go White! The legendary Michigan State vs Michigan game was always an exhilarating experience, it brought out our competitive spirit in the best way.",
            },
            {
                image: ambuGradPic,
                date: "December 2021",
                title: "Ambu Graduation",
                description: "From Valedictorian to undergrad graduation in 2 years! Ambika's academic excellence has always been an inspiration, onwards onto medical school!",
            },
            {
                image: sahilGradPic,
                date: "May 2023",
                title: "Sahil Graduation",
                description: "It's a wrap! Sahil got the girl, the degree, the job and got to throw the graduation cap up in the biggest stadium in America! Onwards to NYC.",
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
                description: "After 6 years together, the perfect time had arrived to pop the question! With lots of help from family and friends, Sahil put together the legendary proposal Ambika deserved.",
            },
            {
                image: proposalChampagnePic,
                date: "June 2025",
                title: "Proposal Champagne",
                description: "In all the happiness, a nice cold champagne toast to help with the Chicago heat and mark the celebratory moment.",
            },
            {
                image: proposalLedgePosePic,
                date: "June 2025",
                title: "Proposal Ledge Pose",
                description: "Having a private proposal at Chicago's London house, we had to take the opportunity to take engagement photos with the iconic Chicago skyline.",
            },
            {
                image: barcelonaPic,
                date: "July 2025",
                title: "Barcelona",
                description: "Time the celebrate the engagement! Our first times traveling across Europe as adults, Florence was historical, adventurous, and full of character.",
            },
            {
                image: madridPic,
                date: "July 2025",
                title: "Madrid",
                description: "Next stop, Madrid! This city was spectular in every way, one of our favorite moments was touring the storied royal Madrid palace.",
            },
            {
                image: florencePic,
                date: "June 2025",
                title: "Florence",
                description: "First time in Italy! Florence was an incredible step back into the past, from wine windows to the Duomo, this city felt magical.",
            },
            {
                image: rokaBackyardPic,
                date: "August 2025",
                title: "Roka",
                description: "The start of the wedding festivies! A roka is a traditional Punjabi ceremony done for the bride and groom to begin joining the families together.",
            },
            {
                image: engagementPartyPic,
                date: "August 2025",
                title: "Engagement Party",
                description: "Time to party! A night filled with laughs, smiles, and unlimited happniess surrounded by the best people.",
            },
        ]
    }
]



const Journey = () => {
    return (
        <div className="min-h-full bg-[#faf0e6] py-16 px-4 overflow-x-hidden">
            <div className="text-center mb-16">
                <h1 className="font-prata text-5xl md:text-7xl text-[#4a4a4a] mb-4">Our Journey</h1>
                <div className="flex items-center justify-center gap-4">
                    <span className="h-px w-12 md:w-16 bg-[#691700]"></span>
                    <span className="text-[#991D00] text-2xl md:text-3xl">♥</span>
                    <span className="h-px w-12 md:w-16 bg-[#691700]"></span>
                </div>
            </div>

            <div className="max-w-4xl mx-auto relative">

                {timelineEvents.map((chapter, chapterIndex) => {
                    return (
                        <>
                        <div key={chapterIndex} className={`mb-12 md:mb-16 sm:ml-16 flex items-center underline underline-offset-10 ${((chapterIndex % 2) === 0) ? 'justify-start' : 'justify-end'}`}>
                            <h2 className="text-3xl font-prata text-[#4a4a4a] mb-2">{chapter.title}</h2>
                        </div>
                        {
                        chapter.events.map((event) => {
                        const isLeft = (chapterIndex % 2) === 0
                        index += 1
                        return (
                                <div
                                    key={index}
                                    className={`relative flex items-center mb-12 md:mb-0 justify-start md:${isLeft ? 'justify-start' : 'justify-end'}`}
                                >
                                    <div className="absolute left-4 md:left-1/2 md:transform md:-translate-x-1/2 h-full w-0.5 bg-[#691700]"></div>

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
                                        <div className="mt-3 mb-3 font-prata ">
                                            <div className={`mt-3 text-left ${isLeft ? 'md:text-right' : 'md:text-left'}`}>
                                                <span className="font-prata inline-block px-3 py-1 bg-[#A32100] text-[#d4b896] rounded-full text-sm md:text-base font-medium tracking-wide">
                                                    {event.date}
                                                </span>
                                            </div>
                                            <h4 className="font-prata text-xl md:text-2xl text-[#4a4a4a] mt-2">
                                                {event.title}
                                            </h4>
                                            <div className="font-prata text-[#4a4a4a] mt-1 text-sm md:text-base"> 
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