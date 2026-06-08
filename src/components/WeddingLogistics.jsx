import "../App.css"
import Confetti from 'react-confetti'
import { useWindowSize } from 'react-use'
import { useState, useEffect } from "react"
import saveTheDateBack from "../assets/saveTheDateBack.png"
import { query, collection, where, getDocs, addDoc } from "firebase/firestore";
import { db } from "../firebase_config"



const WeddingLogistics = () => {
    const { width, height } = useWindowSize();
    const [showConfetti, setShowConfetti] = useState(true);
    const [opacity, setOpacity] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [error, setError] = useState("");
    const [confirmed, setConfirmed] = useState(false);
    const [numGuests, setNumGuests] = useState(0);


    useEffect(() => {
        const fadeTimer = setTimeout(() => setOpacity(0), 3000);
        const removeTimer = setTimeout(() => setShowConfetti(false), 5000);
        return () => { 
            clearTimeout(fadeTimer); 
            clearTimeout(removeTimer); 
        };
    }, []);


    const handleClose = () => {
        setShowModal(false);
        setError("");
        setConfirmed(false);
        setFirstName("");
        setLastName("");
        setPhoneNumber("");
        setNumGuests(0);
    };


    const handleNameInput = async () => {
        if (!firstName.trim() || !lastName.trim()) {
            return;
        }
        setError("");
        let q = query(
            collection(db, "guests"),
            where("firstName", "==", firstName.trim().toLowerCase()),
            where("lastName", "==", lastName.trim().toLowerCase())
        );
        let querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            q = query(
                collection(db, "guests"),
                where("firstName", "==", firstName.trim().toLowerCase()),
                where("lastName", "==", "")
            );
            querySnapshot = await getDocs(q);
        }

        if (querySnapshot.empty) {
            q = query(
                collection(db, "guests"),
                where("firstName", "==", ""),
                where("lastName", "==", lastName.trim().toLowerCase())
            );
            querySnapshot = await getDocs(q);
        }

        if (querySnapshot.empty) {
            setError("Unfortunately the first and last name can't be found. Please try again!");
            return;
        }
        querySnapshot.forEach((doc) => {
            setNumGuests(doc.data().guestCount);
        });
        await addDoc(collection(db, 'rsvpInitializations'), {
            firstName: firstName,
            lastName: lastName,
            phoneNumber: phoneNumber
        });
        setConfirmed(true);
    };


    const handleContinue = () => {
        if (confirmed) {
            handleClose();
            window.open("https://forms.gle/qixYebebCixsndzD7", "_blank", "noopener,noreferrer");
        } else {
            handleNameInput();
        }
    };


    return (
        <div className="min-h-full bg-[#faf0e6] py-14 px-4 overflow-x-hidden">
            {showConfetti && (
                <Confetti
                    width={width}
                    height={height}
                    frameRate={60}
                    style={{ transition: "opacity 2s ease-out", opacity }}
                />
            )}

            {showModal && (
                <div
                    className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4"
                    onClick={handleClose}
                >
                    <div
                        className="bg-[#faf0e6] rounded-xl px-10 py-10 w-full max-w-lg flex flex-col items-center gap-6 shadow-xl"
                        onClick={e => e.stopPropagation()}
                    >
                        <h3 className="font-prata text-2xl text-[#691700]">Hotel Booking</h3>

                        {!confirmed && (
                            <div className="flex flex-col gap-3 w-full">
                                <input
                                    type="text"
                                    placeholder="First name"
                                    value={firstName}
                                    onChange={e => setFirstName(e.target.value)}
                                    onKeyDown={e => e.key === "Enter" && handleNameInput()}
                                    className="font-prata text-[#4a4a4a] bg-white border border-[#691700]/30 rounded-lg px-4 py-2.5 outline-none focus:border-[#691700] transition-colors placeholder:text-[#aaa] w-full"
                                />
                                <input
                                    type="text"
                                    placeholder="Last name"
                                    value={lastName}
                                    onChange={e => setLastName(e.target.value)}
                                    onKeyDown={e => e.key === "Enter" && handleNameInput()}
                                    className="font-prata text-[#4a4a4a] bg-white border border-[#691700]/30 rounded-lg px-4 py-2.5 outline-none focus:border-[#691700] transition-colors placeholder:text-[#aaa] w-full"
                                />
                                <input
                                    type="text"
                                    placeholder="Phone Number"
                                    value={phoneNumber}
                                    onChange={e => setPhoneNumber(e.target.value)}
                                    onKeyDown={e => e.key === "Enter" && handleNameInput()}
                                    className="font-prata text-[#4a4a4a] bg-white border border-[#691700]/30 rounded-lg px-4 py-2.5 outline-none focus:border-[#691700] transition-colors placeholder:text-[#aaa] w-full"
                                />
                            </div>
                        )}

                        {error && (
                            <p className="font-prata text-[#691700] text-sm text-center">{error}</p>
                        )}

                        {confirmed && (
                           <div className="font-prata text-[#5a5a5a] text-sm md:text-lg text-center leading-relaxed space-y-2.5">
                                <p>Hi {firstName}!</p>
                                <p>We've reserved <span className="text-[#691700]">{numGuests} {numGuests === 1 ? "guest" : "guests"}</span> for you!</p>
                                <p>Press <span className="italic">Continue</span> to be taken to the RSVP form.</p>
                            </div>
                        )}

                        <div className="flex gap-3 w-full">
                            <button
                                onClick={handleClose}
                                className="flex-1 font-prata text-[#691700] border border-[#691700]/30 px-3 py-2 rounded-lg transition-all duration-200 hover:border-[#691700] cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleContinue}
                                disabled={!confirmed && (!firstName.trim() || !lastName.trim())}
                                className="flex-1 font-prata text-lg text-white bg-[#691700] px-3 py-2 rounded-lg transition-all duration-200 hover:bg-[#4a1000] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            >
                                Continue
                            </button>
                        </div>
                    </div>
                </div>
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
                <h2 className="font-prata text-3xl md:text-3xl lg:text-4xl text-[#4a4a4a] mt-1 md:mt-2 mb-2 text-center">
                    RSVP
                </h2>

                <div className="flex items-center justify-center gap-2 md:gap-3 mb-2 md:mb-4">
                    <span className="h-px w-8 md:w-12 bg-[#691700]"></span>
                    <span className="text-[#991D00] text-sm md:text-base">✦</span>
                    <span className="h-px w-8 md:w-12 bg-[#691700]"></span>
                </div>

                <div className="font-prata text-[#5a5a5a] text-md md:text-lg mt-2 space-y-2.5 md:space-y-3">
                    <p className="leading-relaxed">
                        We have a discounted rate on rooms from <span className="text-[#691700]">May 31 – June 7</span>, with wedding events taking place <span className="text-[#691700]">June 3 – 5</span>.
                    </p>
                    <p className="leading-relaxed">
                        Per venue policy, the RSVP must be made using the link below.
                    </p>
                    <p className="leading-relaxed">
                        We appreciate your understanding and can't wait to celebrate with you!
                    </p>
                </div>

                <button
                    onClick={() => setShowModal(true)}
                    className="mt-5 inline-block font-prata text-lg text-white bg-[#691700] px-6 py-2 rounded-lg transition-all duration-200 hover:bg-[#4a1000] hover:-translate-y-0.5 cursor-pointer"
                >
                    Hotel Booking
                </button>
            </section>
        </div>
    );
}

export default WeddingLogistics;