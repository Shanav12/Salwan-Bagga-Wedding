

const Lineup = () => {
    const allImages = import.meta.glob('../assets/bach-trip/*', { eager: true })
    return (
        <div className="min-h-full bg-[#faf0e6] py-16 px-4 overflow-x-hidden">
            <div className="text-center mb-16">
                <h1 className="font-prata text-5xl md:text-7xl text-[#4a4a4a] mb-4">Lineup </h1>
                <div className="flex items-center justify-center gap-4">
                    <span className="h-px w-12 md:w-16 bg-[#691700]"></span>
                    <span className="text-[#991D00] text-2xl md:text-3xl">♥</span>
                    <span className="h-px w-12 md:w-16 bg-[#691700] "></span>
                </div>
                <div className="mb-6"></div>
                {Object.values(allImages).map((image, index) => (
                    <img key={index} src={image.default} className=" w-[90%] md:w-[70%] mx-auto mb-10" />
                ))}
            </div>
            <div className="max-w-4xl mx-auto relative">
            </div>
        </div>
    )
}


export default Lineup;