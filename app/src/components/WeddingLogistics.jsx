import "../App.css"
import Confetti from 'react-confetti'
import { useWindowSize } from 'react-use'
import { useState, useEffect } from "react"
import saveTheDateBack from "../assets/saveTheDateBack.webp"


const WeddingLogistics = () => {
    const { width, height } = useWindowSize();
    const [showConfetti, setShowConfetti] = useState(true);
    const [opacity, setOpacity] = useState(1);


    useEffect(() => {
        const fadeTimer = setTimeout(() => {
            setOpacity(0);
        }, 3000);

        const removeTimer = setTimeout(() => {
            setShowConfetti(false);
        }, 5000);

        return () => {
            clearTimeout(fadeTimer);
            clearTimeout(removeTimer);
        };
    }, [])


    return (
         <div className="min-h-full bg-[#faf0e6] py-14 px-4 overflow-x-hidden">
            {showConfetti && (
                <Confetti
                    width={width}
                    height={height}
                    frameRate={60}
                    style={{
                        transition: "opacity 2s ease-out",
                        opacity: opacity,
                    }}
                />
            )}
            <div className="text-center mb-4">
                <h1 className="font-prata text-5xl md:text-6xl text-[#4a4a4a] mb-4">Wedding Logistics</h1>
                <div className="flex items-center justify-center gap-4">
                    <span className="h-px w-12 md:w-16 bg-[#691700]"></span>
                    <span className="text-[#991D00] text-2xl md:text-3xl">♥</span>
                    <span className="h-px w-12 md:w-16 bg-[#691700]"></span>
                </div>
            </div>

            <div className="flex justify-center px-6 py-8">
                <div className="relative">
                    <div className="absolute inset-0 bg-[#691700] rounded-lg transform rotate-3"></div>
                    <img
                        src={saveTheDateBack}
                        alt="Sahil and Ambika's Engagement"
                        className="relative rounded-lg shadow-xl w-80 h-auto md:w-96 md:h-auto object-contain"
                    />
                </div>
            </div>
            
            <section className="max-w-2xl md:max-w-3xl mx-auto px-4 py-6 text-center">
                <p className="font-prata text-[#5a5a5a] leading-relaxed text-xl mt-6">
                    More Details to Come...
                </p>
            </section>

        </div>
    )
}

export default WeddingLogistics;