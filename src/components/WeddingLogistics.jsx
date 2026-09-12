import PhoneInput, { parsePhoneNumber } from "react-phone-number-input";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import { useState, useEffect } from "react";
import saveTheDateBack from "../assets/saveTheDateBack.png";
import EventCard from "./EventCard";
import {
  lookupGuest,
  lookupExistingRsvps,
  saveRsvps,
  notifyGoogleSheets,
} from "../api/rsvp";
import "react-phone-number-input/style.css";
import "../App.css";

const EVENTS = [
  { key: "haldi", label: "Ganesh Pooja & Haldi", date: "June 3 — Thursday" },
  { key: "sangeet", label: "Sangeet", date: "June 3 — Thursday" },
  { key: "baraat", label: "Baraat", date: "June 4 — Friday" },
  {
    key: "weddingCeremony",
    label: "Wedding Ceremony",
    date: "June 4 — Friday",
  },
  {
    key: "cocktailDinner",
    label: "Cocktail & Dinner",
    date: "June 4 — Friday",
  },
  { key: "cocktailHour", label: "Cocktail Hour", date: "June 5 — Saturday" },
  { key: "dinner", label: "Dinner", date: "June 5 — Saturday" },
];

const EVENT_DAYS = [
  {
    key: "june3",
    label: "June 3",
    weekday: "Thursday",
    events: [
      {
        time: "10:00 am",
        name: "Ganesh Pooja and Haldi",
        location: "Retune Terrace",
      },
      { time: "5:30 pm", name: "Sangeet", location: "Serenade Terrace" },
    ],
  },
  {
    key: "june4",
    label: "June 4",
    weekday: "Friday",
    events: [
      { time: "3:00 pm", name: "Baraat" },
      { time: "4:00 pm", name: "Wedding Ceremony", location: "Coda Gardens" },
      {
        time: "7:00 pm",
        name: "Cocktail & Dinner",
        location: "Moonlight Terrace",
      },
    ],
  },
  {
    key: "june5",
    label: "June 5",
    weekday: "Saturday",
    events: [
      { time: "6:00 pm", name: "Cocktail Hour", location: "Harmony Ballroom" },
      { time: "7:30 pm", name: "Dinner", location: "Harmony Ballroom" },
    ],
  },
];

const HOTEL_URL = "https://www.shaadidestinations.com/ambika-and-sahil";

const toTitleCase = (str) => str.replace(/\b\w/g, (c) => c.toUpperCase());

const NAME_ROLES = {
  "shanav bagga": "Best Man",
  "sahil bagga": "Groom",
  "chandan bagga": "Father of the Groom",
  "ambika salwan": "Bride",
  "sia salwan": "Maid of Honor",
  "arun salwan": "Father of the Bride",
  "priyanka salwan": "Mother of the Bride",
};

const initAttendance = (members) =>
  Object.fromEntries(
    members.map((m) => [
      m,
      Object.fromEntries(EVENTS.map((e) => [e.key, null])),
    ]),
  );

const Divider = ({ large = false }) => (
  <div className="flex items-center justify-center gap-2 md:gap-3">
    <span
      className={`h-px bg-[#691700] ${large ? "w-12 md:w-16" : "w-8 md:w-12"}`}
    ></span>
    <span
      className={`text-[#991D00] ${large ? "text-2xl md:text-3xl" : "text-sm md:text-base"}`}
    >
      {large ? "♥" : "✦"}
    </span>
    <span
      className={`h-px bg-[#691700] ${large ? "w-12 md:w-16" : "w-8 md:w-12"}`}
    ></span>
  </div>
);

const PrimaryButton = ({ onClick, disabled, children, className = "" }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`font-prata text-lg text-white bg-[#691700] px-3 py-2 rounded-lg transition-all duration-200 hover:bg-[#4a1000] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${className}`}
  >
    {children}
  </button>
);

const SecondaryButton = ({ onClick, children, className = "" }) => (
  <button
    onClick={onClick}
    className={`font-prata text-[#691700] border border-[#691700]/30 px-3 py-2 rounded-lg transition-all duration-200 hover:border-[#691700] cursor-pointer ${className}`}
  >
    {children}
  </button>
);

const AttendanceToggle = ({ value, onChange }) => (
  <div className="flex gap-2">
    <button
      onClick={() => onChange(true)}
      className={`flex-1 font-prata text-xs px-3 py-2 rounded-lg border transition-all duration-150 cursor-pointer ${
        value === true
          ? "bg-[#691700]/85 text-white border-[#691700]/85"
          : "bg-white text-[#4a4a4a] border-[#691700]/30 hover:border-[#691700]"
      }`}
    >
      Will be in attendance
    </button>
    <button
      onClick={() => onChange(false)}
      className={`flex-1 font-prata text-xs px-3 py-2 rounded-lg border transition-all duration-150 cursor-pointer ${
        value === false
          ? "bg-[#691700]/85 text-white border-[#691700]/85"
          : "bg-white text-[#4a4a4a] border-[#691700]/30 hover:border-[#691700]"
      }`}
    >
      Unfortunately can't make it
    </button>
  </div>
);

const ModalStep1 = ({
  firstName,
  lastName,
  phoneNumber,
  error,
  onFirstNameChange,
  onLastNameChange,
  onPhoneChange,
  onContinue,
  onClose,
}) => (
  <>
    <h3 className="font-prata text-2xl text-[#691700]">RSVP</h3>
    <p className="font-prata text-[#5a5a5a] text-sm text-center leading-relaxed">
      Please enter your name so we can pull up your party!
    </p>
    <div className="flex flex-col gap-3 w-full">
      <input
        type="text"
        placeholder="First name"
        value={firstName}
        onChange={(e) => onFirstNameChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onContinue()}
        className="font-prata text-[#4a4a4a] bg-white border border-[#691700]/30 rounded-lg px-4 py-2.5 outline-none focus:border-[#691700] transition-colors placeholder:text-[#aaa] w-full"
      />
      <input
        type="text"
        placeholder="Last name"
        value={lastName}
        onChange={(e) => onLastNameChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onContinue()}
        className="font-prata text-[#4a4a4a] bg-white border border-[#691700]/30 rounded-lg px-4 py-2.5 outline-none focus:border-[#691700] transition-colors placeholder:text-[#aaa] w-full"
      />
      <PhoneInput
        defaultCountry="US"
        value={phoneNumber}
        onChange={onPhoneChange}
        placeholder="Phone number"
        className="phone-input-wedding"
      />
    </div>
    {error && (
      <p className="font-prata text-[#691700] text-sm text-center">{error}</p>
    )}
    <div className="flex gap-3 w-full">
      <SecondaryButton onClick={onClose} className="flex-1">
        Cancel
      </SecondaryButton>
      <PrimaryButton
        onClick={onContinue}
        disabled={!firstName.trim() || !lastName.trim()}
        className="flex-1"
      >
        Continue
      </PrimaryButton>
    </div>
  </>
);

const ModalStep2 = ({ firstName, lastName, onModify, onClose }) => {
  const fullKey = `${firstName.trim()} ${lastName.trim()}`.toLowerCase();
  const displayName = NAME_ROLES[fullKey] ?? toTitleCase(firstName);
  return (
    <>
      <h3 className="font-prata text-2xl text-[#691700] text-center">
        Thank You!
      </h3>
      <div className="font-prata text-[#5a5a5a] text-sm md:text-base text-center leading-relaxed space-y-3">
        <p>Hi {displayName}! We already have your RSVP on file.</p>
        <p>
          Click below to book your hotel, or modify your response if anything
          has changed.
        </p>
      </div>
      <div className="flex flex-col gap-3 w-full">
        <PrimaryButton
          onClick={() =>
            window.open(HOTEL_URL, "_blank", "noopener,noreferrer")
          }
          className="w-full"
        >
          Book Hotel
        </PrimaryButton>
        <SecondaryButton onClick={onModify} className="w-full">
          Modify RSVP
        </SecondaryButton>
        <button
          onClick={onClose}
          className="w-full font-prata text-sm text-[#888] px-3 py-1 cursor-pointer hover:text-[#691700] transition-colors"
        >
          Close
        </button>
      </div>
    </>
  );
};

const ModalStep3 = ({
  partyMembers,
  attendance,
  dietary,
  error,
  submitting,
  onAttendanceChange,
  onDietaryChange,
  onSubmit,
  onClose,
}) => (
  <>
    <h3 className="font-prata text-2xl text-[#691700] text-center">
      Party RSVP
    </h3>
    <p className="font-prata text-[#5a5a5a] text-sm text-center leading-relaxed">
      Let us know who from your party will be attending each event!
    </p>

    <div className="flex flex-col gap-8 w-full">
      {partyMembers.map((member) => (
        <div key={member} className="flex flex-col gap-4">
          <div className="border-b border-[#691700]/20 pb-2">
            <h4 className="font-prata text-lg text-[#1a1a1a]">
              {toTitleCase(member)}
            </h4>
            {NAME_ROLES[member] && (
              <span className="font-prata text-xs text-[#691700]">
                {NAME_ROLES[member]}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-3">
            {EVENTS.map((event) => (
              <div key={event.key} className="flex flex-col gap-1.5">
                <div className="flex flex-col">
                  <span className="font-prata text-sm text-[#691700]">
                    {event.label}
                  </span>
                  <span className="font-prata text-xs text-[#888]">
                    {event.date}
                  </span>
                </div>
                <AttendanceToggle
                  value={attendance[member]?.[event.key]}
                  onChange={(val) => onAttendanceChange(member, event.key, val)}
                />
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-prata text-sm text-[#1a1a1a]">
              Dietary Restrictions
            </label>
            <textarea
              rows={2}
              placeholder="Please list any dietary restrictions or allergies (leave blank if none)"
              value={dietary[member] ?? ""}
              onChange={(e) => onDietaryChange(member, e.target.value)}
              className="font-prata text-sm text-[#4a4a4a] bg-white border border-[#691700]/30 rounded-lg px-4 py-2.5 outline-none focus:border-[#691700] transition-colors placeholder:text-[#aaa] w-full resize-none"
            />
          </div>
        </div>
      ))}
    </div>

    {error && (
      <p className="font-prata text-[#691700] text-sm text-center">{error}</p>
    )}

    <div className="flex gap-3 w-full">
      <SecondaryButton onClick={onClose} className="flex-1">
        Cancel
      </SecondaryButton>
      <PrimaryButton
        onClick={onSubmit}
        disabled={submitting}
        className="flex-1"
      >
        {submitting ? "Submitting…" : "Submit RSVP"}
      </PrimaryButton>
    </div>
  </>
);

const ModalConfirmation = ({ onClose }) => (
  <>
    <h3 className="font-prata text-2xl text-[#691700] text-center">
      Thank You!
    </h3>
    <div className="font-prata text-[#5a5a5a] text-sm md:text-base text-center leading-relaxed space-y-3">
      <p>Your RSVP has been received!</p>
      <p>Please click on the button to continue and book your hotel.</p>
      <p>We can't wait to celebrate with you!</p>
    </div>
    <div className="flex gap-3 w-full">
      <SecondaryButton onClick={onClose} className="flex-1">
        Close
      </SecondaryButton>
      <PrimaryButton
        onClick={() => window.open(HOTEL_URL, "_blank", "noopener,noreferrer")}
        className="flex-1"
      >
        Book Hotel
      </PrimaryButton>
    </div>
  </>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const WeddingLogistics = () => {
  const { width, height } = useWindowSize();
  const [showConfetti, setShowConfetti] = useState(true);
  const [confettiOpacity, setConfettiOpacity] = useState(1);

  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [partyMembers, setPartyMembers] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [dietary, setDietary] = useState({});
  const [existingRsvpIds, setExistingRsvpIds] = useState({});

  const [openDays, setOpenDays] = useState(new Set());

  useEffect(() => {
    const fadeTimer = setTimeout(() => setConfettiOpacity(0), 3000);
    const removeTimer = setTimeout(() => setShowConfetti(false), 5000);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  const resetModal = () => {
    setStep(1);
    setError("");
    setSubmitted(false);
    setSubmitting(false);
    setFirstName("");
    setLastName("");
    setPhoneNumber("");
    setPartyMembers([]);
    setAttendance({});
    setDietary({});
    setExistingRsvpIds({});
  };

  const handleClose = () => {
    setShowModal(false);
    resetModal();
  };

  const handleLookup = async () => {
    if (!firstName.trim() || !lastName.trim()) return;
    setError("");

    const guestSnap = await lookupGuest(firstName, lastName);
    if (!guestSnap) {
      setError(
        "Unfortunately the first and last name can't be found. Please try again!",
      );
      return;
    }

    const docs = guestSnap.docs;
    let matchedDoc = docs[0];

    if (docs.length > 1) {
      const docsWithPhone = docs.filter((d) => d.data().phoneNumber);
      if (docsWithPhone.length > 0) {
        const enteredDigits = phoneNumber ? phoneNumber.replace(/\D/g, "") : "";
        if (!enteredDigits) {
          setError(
            "Multiple guests share this name. Please enter your phone number to continue.",
          );
          return;
        }
        const phoneMatch = docsWithPhone.find((d) => {
          const stored = d.data().phoneNumber.replace(/\D/g, "");
          return (
            stored.endsWith(enteredDigits) || enteredDigits.endsWith(stored)
          );
        });
        if (!phoneMatch) {
          setError(
            "Multiple guests share this name and the phone number didn't match. Please double-check and try again.",
          );
          return;
        }
        matchedDoc = phoneMatch;
      }
    }

    const data = matchedDoc.data();
    const self = `${firstName.trim()} ${lastName.trim()}`.toLowerCase();
    const extras = Array.isArray(data.partyMembers) ? data.partyMembers : [];
    const members = [
      self,
      ...extras.map((m) => m.toLowerCase()).filter((m) => m !== self),
    ];

    const existingRsvps = await lookupExistingRsvps(members);

    let att = initAttendance(members);
    let diet = Object.fromEntries(members.map((m) => [m, ""]));

    members.forEach((member) => {
      const prior = existingRsvps[member];
      if (!prior) return;
      EVENTS.forEach((e) => {
        if (prior.events?.[e.key] !== undefined)
          att[member][e.key] = prior.events[e.key];
      });
      diet[member] = prior.dietaryRestrictions ?? "";
    });

    setExistingRsvpIds(
      Object.fromEntries(
        Object.entries(existingRsvps).map(([name, data]) => [name, data.id]),
      ),
    );
    setPartyMembers(members);
    setAttendance(att);
    setDietary(diet);
    setStep(Object.keys(existingRsvps).length > 0 ? 2 : 3);
  };

  const handleAttendanceChange = (member, eventKey, value) => {
    setAttendance((prev) => ({
      ...prev,
      [member]: { ...prev[member], [eventKey]: value },
    }));
  };

  const allAnswered = () =>
    partyMembers.every((m) =>
      EVENTS.every(
        (e) =>
          attendance[m]?.[e.key] !== null &&
          attendance[m]?.[e.key] !== undefined,
      ),
    );

  const handleSubmit = async () => {
    if (!allAnswered()) {
      setError("Please select attendance for every event and party member.");
      return;
    }
    setError("");
    setSubmitting(true);

    const parsed = phoneNumber ? parsePhoneNumber(phoneNumber) : null;
    const formattedPhone = parsed
      ? `+${parsed.countryCallingCode} ${parsed.nationalNumber}`
      : phoneNumber;

    const submittedBy = `${firstName.trim()} ${lastName.trim()}`.toLowerCase();
    const memberRsvps = partyMembers.map((m) => ({
      name: m,
      events: EVENTS.reduce(
        (acc, e) => ({ ...acc, [e.key]: attendance[m][e.key] }),
        {},
      ),
      dietaryRestrictions: dietary[m]?.trim() || "",
      submittedBy,
      phoneNumber: formattedPhone,
    }));

    await saveRsvps(memberRsvps, existingRsvpIds);
    notifyGoogleSheets({
      submittedBy,
      phoneNumber: formattedPhone,
      members: memberRsvps,
    });

    setSubmitting(false);
    setSubmitted(true);
  };

  const toggleDay = (key) => {
    setOpenDays((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  return (
    <div className="min-h-full bg-[#faf0e6] py-14 px-4">
      {showConfetti && (
        <Confetti
          width={width}
          height={height}
          frameRate={60}
          style={{
            transition: "opacity 2s ease-out",
            opacity: confettiOpacity,
          }}
        />
      )}

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4 py-8"
          onClick={handleClose}
        >
          <div
            className="bg-[#faf0e6] rounded-xl px-8 py-8 w-full max-w-xl flex flex-col items-center gap-5 shadow-xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {step === 1 && (
              <ModalStep1
                firstName={firstName}
                lastName={lastName}
                phoneNumber={phoneNumber}
                error={error}
                onFirstNameChange={setFirstName}
                onLastNameChange={setLastName}
                onPhoneChange={setPhoneNumber}
                onContinue={handleLookup}
                onClose={handleClose}
              />
            )}
            {step === 2 && !submitted && (
              <ModalStep2
                firstName={firstName}
                lastName={lastName}
                onModify={() => setStep(3)}
                onClose={handleClose}
              />
            )}
            {step === 3 && !submitted && (
              <ModalStep3
                partyMembers={partyMembers}
                attendance={attendance}
                dietary={dietary}
                error={error}
                submitting={submitting}
                onAttendanceChange={handleAttendanceChange}
                onDietaryChange={(member, val) =>
                  setDietary((prev) => ({ ...prev, [member]: val }))
                }
                onSubmit={handleSubmit}
                onClose={handleClose}
              />
            )}
            {submitted && <ModalConfirmation onClose={handleClose} />}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-4">
        <h1 className="font-prata text-5xl md:text-6xl text-[#4a4a4a] mb-4">
          Wedding Logistics
        </h1>
        <Divider large />
      </div>

      {/* Photo */}
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

      {/* RSVP Section */}
      <section className="max-w-2xl md:max-w-3xl mx-auto px-4 py-6 text-center">
        <h2 className="font-prata text-3xl md:text-4xl text-[#4a4a4a] mt-1 md:mt-2 mb-2">
          RSVP
        </h2>
        <div className="mb-2 md:mb-4">
          <Divider />
        </div>
        <div className="font-prata text-[#5a5a5a] text-md md:text-lg mt-2 space-y-2.5 md:space-y-3">
          <p className="leading-relaxed">
            Please note that we have secured a heavily discounted room rate for
            our guests from May 31 through June 7, 2027.
          </p>
          <p className="leading-relaxed">
            The wedding events will take place June 3–5.
          </p>
          <p className="leading-relaxed">
            Please RSVP below so we know who from your party will be joining us
            for each event.
          </p>
          <p className="leading-relaxed">
            We can't wait to celebrate with you!
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="mt-5 inline-block font-prata text-lg text-white bg-[#691700] px-6 py-2 rounded-lg transition-all duration-200 hover:bg-[#4a1000] hover:-translate-y-0.5 cursor-pointer"
        >
          RSVP Form
        </button>
      </section>

      {/* Events Section */}
      <section className="max-w-2xl md:max-w-3xl mx-auto px-4 py-6 mb-10">
        <h2 className="font-prata text-3xl md:text-4xl text-[#4a4a4a] text-center mb-2">
          Events
        </h2>
        <div className="mb-6">
          <Divider />
        </div>

        {EVENT_DAYS.map((day, i) => (
          <div
            key={day.key}
            className={
              i < EVENT_DAYS.length - 1 ? "border-b border-[#691700]/15" : ""
            }
          >
            <button
              onClick={() => toggleDay(day.key)}
              className="w-full flex items-center justify-between py-5 cursor-pointer"
            >
              <div className="flex items-baseline gap-3">
                <span className="font-prata text-xl md:text-2xl text-[#1a1a1a]">
                  {day.label}
                </span>
                <span className="font-prata text-black text-sm">
                  — {day.weekday}
                </span>
              </div>
              <svg
                className={`text-[#691700] transition-transform duration-200 ${openDays.has(day.key) ? "rotate-180" : ""}`}
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
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
};

export default WeddingLogistics;
