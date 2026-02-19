import "../App.css"



const WeddingLogistics = () => {
    return (
         <div className="min-h-full bg-[#faf0e6] py-16 px-4 overflow-x-hidden">
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
                    More Details to Come...
                </p>
            </section>

        </div>
    )
}

export default WeddingLogistics;