

const Lineup = () => {
    const allImages = import.meta.glob('../assets/bach-trip/*', { eager: true })
    return (
        <div className="min-h-full bg-[#faf0e6] py-14 overflow-x-hidden">
            <div className="text-center mb-16 px-0">
                <h1 className="font-prata text-5xl md:text-6xl text-[#4a4a4a] mb-4 px-4">Wedding Party Lineup</h1>
                <div className="flex items-center justify-center gap-4 mb-10">
                    <span className="h-px w-12 md:w-16 bg-[#691700]"></span>
                    <span className="text-[#991D00] text-2xl md:text-3xl">♥</span>
                    <span className="h-px w-12 md:w-16 bg-[#691700]"></span>
                </div>
                {Object.values(allImages).map((image, index) => (
                    <img 
                        key={index} 
                        src={image.default} 
                        className="w-full md:w-[50%] mx-auto mb-10 block"
                        loading="lazy"
                    />
                ))}
            </div>
        </div>
    )
}


export default Lineup;