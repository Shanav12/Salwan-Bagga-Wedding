import PhoneInput, { parsePhoneNumber } from 'react-phone-number-input'
import Confetti from 'react-confetti'
import { useWindowSize } from 'react-use'
import { useState, useEffect } from "react"
import saveTheDateBack from "../assets/saveTheDateBack.png"
import { query, collection, where, getDocs, addDoc } from "firebase/firestore";
import EventCard from "./EventCard";
import { db } from "../firebase_config"
import 'react-phone-number-input/style.css'
import "../App.css"



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
    const [openDays, setOpenDays] = useState(new Set());
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

        const docs = [];
        querySnapshot.forEach((doc) => docs.push(doc));

        let matchedDoc = docs[0];
        if (docs.length > 1) {
            const docsWithPhone = docs.filter((doc) => doc.data().phoneNumber);
            if (docsWithPhone.length > 0) {
                const enteredDigits = phoneNumber ? phoneNumber.replace(/\D/g, "") : "";
                if (!enteredDigits) {
                    setError("Multiple guests share this name. Please enter your phone number to continue.");
                    return;
                }
                const phoneMatch = docsWithPhone.find((doc) =>
                    doc.data().phoneNumber.replace(/\D/g, "").endsWith(enteredDigits) ||
                    enteredDigits.endsWith(doc.data().phoneNumber.replace(/\D/g, ""))
                );
                if (!phoneMatch) {
                    setError("Multiple guests share this name and the phone number didn't match. Please double-check and try again.");
                    return;
                }
                matchedDoc = phoneMatch;
            }
        }

        setNumGuests(matchedDoc.data().guestCount);

        const parsed = phoneNumber ? parsePhoneNumber(phoneNumber) : null;
        const formattedPhone = parsed
            ? `+${parsed.countryCallingCode} ${parsed.nationalNumber}`
            : phoneNumber;
        await addDoc(collection(db, 'rsvpInitializations'), {
            firstName: firstName,
            lastName: lastName,
            phoneNumber: formattedPhone,
        });
        setConfirmed(true);
    };


    const handleContinue = () => {
        if (confirmed) {
            handleClose();
            window.open("https://www.shaadidestinations.com/ambika-and-sahil", "_blank", "noopener,noreferrer");
        } else {
            handleNameInput();
        }
    };


    return (
        <div className="min-h-full bg-[#faf0e6] py-14 px-4">
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
                        className="bg-[#faf0e6] rounded-xl px-10 py-10 w-full max-w-lg flex flex-col items-center gap-6 shadow-xl relative"
                        onClick={e => e.stopPropagation()}
                    >
                        <button
                            onClick={handleClose}
                            className="absolute top-3 right-4 text-2xl text-[#691700]/50 hover:text-[#691700] border border-[#691700]/30 hover:border-[#691700] rounded-md w-8 h-8 flex items-center justify-center transition-colors cursor-pointer"
                            aria-label="Close"
                        >
                            &times;
                        </button>
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
                                <PhoneInput
                                    defaultCountry="US"
                                    value={phoneNumber}
                                    onChange={setPhoneNumber}
                                    placeholder="Phone number"
                                    className="phone-input-wedding"
                                />
                            </div>
                        )}

                        {error && (
                            <p className="font-prata text-[#691700] text-sm text-center">{error}</p>
                        )}

                        {confirmed && (
                           <div className="font-prata text-[#5a5a5a] text-sm md:text-lg text-center leading-relaxed space-y-2.5">
                                {(() => {
                                    const specialTitle = {
                                        sia: "Maid of Honor",
                                        ambika: "Bride",
                                        sahil: "Groom",
                                        shanav: "Best Man",
                                        arun: "Father of the Bride",
                                        priyanka: "Mother of the Bride",
                                        chandan: "Father of the Groom",
                                    }[firstName.toLowerCase()];
                                    return specialTitle
                                        ? <p>Hi <span className="italic text-[#691700]">{specialTitle}</span><span className="italic">!</span></p>
                                        : <p>Hi {firstName}!</p>;
                                })()}
                                <p>We've reserved <span className="text-[#691700]">{numGuests} {numGuests === 1 ? "guest" : "guests"}</span> for you!</p>
                                <p>Press <span className="italic">Continue</span> to be taken to the Hotel Booking website.</p>
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

                <div className="font-prata text-[#5a5a5a] text-sm md:text-base lg:text-lg mt-2 space-y-2 md:space-y-3">
                  <p className="leading-relaxed">
                    Please note that we have secured a heavily discounted room rate for our guests from May 31 through June 7, 2027.
                  </p>
                  <p className="leading-relaxed">
                    Per venue policy, the RSVP must be made using the link displayed after submitting the form below.
                  </p>
                  <p className="leading-relaxed">
                    We appreciate your understanding and can't wait to celebrate with you!
                  </p>
                </div>

                <button
                    onClick={() => setShowModal(true)}
                    className="mt-5 inline-block font-prata text-lg text-white bg-[#691700] px-6 py-2 rounded-lg transition-all duration-200 hover:bg-[#4a1000] hover:-translate-y-0.5 cursor-pointer"
                >
                    RSVP Form
                </button>
            </section>

            {/* Events by Day */}
            <section className="max-w-2xl md:max-w-3xl mx-auto px-4 py-6 mb-10">
                <h2 className="font-prata text-3xl md:text-4xl text-[#4a4a4a] text-center mb-2">
                    Events
                </h2>
                <div className="flex items-center justify-center gap-2 md:gap-3 mb-6">
                    <span className="h-px w-8 md:w-12 bg-[#691700]"></span>
                    <span className="text-[#991D00] text-sm md:text-base">✦</span>
                    <span className="h-px w-8 md:w-12 bg-[#691700]"></span>
                </div>

                {[
                    { key: "june3", label: "June 3", weekday: "Thursday", events: [
                        { time: "10:00 am", name: "Ganesh Pooja and Haldi", location: "Retune Terrace" },
                        { time: "5:30 pm", name: "Sangeet", location: "Serenade Terrace" },
                    ]},
                    { key: "june4", label: "June 4", weekday: "Friday", events: [
                        { time: "3:00 pm", name: "Baraat" },
                        { time: "4:00 pm", name: "Wedding Ceremony", location: "Coda Gardens" },
                        { time: "7:00 pm", name: "Cocktail & Dinner", location: "Moonlight Terrace" },
                    ]},
                    { key: "june5", label: "June 5", weekday: "Saturday", events: [
                        { time: "6:00 pm", name: "Cocktail Hour", location: "Harmony Ballroom" },
                        { time: "7:30 pm", name: "Dinner", location: "Harmony Ballroom" },
                    ]},
                ].map((day, i, arr) => (
                    <div key={day.key} className={i < arr.length - 1 ? "border-b border-[#691700]/15" : ""}>
                        <button
                            onClick={() => setOpenDays(prev => {
                                const next = new Set(prev);
                                next.has(day.key) ? next.delete(day.key) : next.add(day.key);
                                return next;
                            })}
                            className="w-full flex items-center justify-between py-5 cursor-pointer"
                        >
                            <div className="flex items-baseline gap-3">
                                <span className="font-prata text-xl md:text-2xl text-[#1a1a1a]">{day.label}</span>
                                <span className="font-prata text-black text-sm">— {day.weekday}</span>
                            </div>
                            <svg
                                className={`text-[#691700] transition-transform duration-200 ${openDays.has(day.key) ? "rotate-180" : ""}`}
                                width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                            >
                                <polyline points="6 9 12 15 18 9" />
                            </svg>
                        </button>
                        {openDays.has(day.key) && (
                            <div className="flex flex-col gap-6 pb-8">
                                {day.events.map((event, j) => (
                                    <EventCard key={j} {...event} />
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </section>
        </div>
    );
}

export default WeddingLogistics;