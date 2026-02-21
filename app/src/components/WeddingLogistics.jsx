import "../App.css"
import Confetti from 'react-confetti'
import { useWindowSize } from 'react-use'
import { useState, useEffect } from "react"



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
         <div className="min-h-full bg-[#faf0e6] py-16 px-4 overflow-x-hidden">
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
            <div className="text-center mb-16">
                <h1 className="font-prata text-5xl md:text-7xl text-[#4a4a4a] mb-4">Wedding Logistics</h1>
                <div className="flex items-center justify-center gap-4">
                    <span className="h-px w-12 md:w-16 bg-[#691700]"></span>
                    <span className="text-[#991D00] text-2xl md:text-3xl">♥</span>
                    <span className="h-px w-12 md:w-16 bg-[#691700]"></span>
                </div>
            </div>
            
            <section className="max-w-2xl md:max-w-3xl mx-auto px-4 py-6 text-center">
                <p className="font-prata text-[#5a5a5a] leading-relaxed text-xl mt-6">
                    Cabo San Lucas
                </p>

                <p className="font-prata text-[#5a5a5a] leading-relaxed text-xl mt-6">
                    5/20/27 - 5/22/27
                </p>

                <p className="font-prata text-[#5a5a5a] leading-relaxed text-xl mt-6">
                    More Details to Come...
                </p>
            </section>

        </div>
    )
}

export default WeddingLogistics;