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
  updateGuestPartyMembers,
  upsertGuestForMember,
} from "../api/rsvp";
import { EVENTS, EVENT_DAYS } from "../weddingConstants";
import {
  ModalStep1,
  ModalStep2,
  ModalStep3,
  ModalConfirmation,
  ModalDraftResume,
} from "./RsvpModal";
import "react-phone-number-input/style.css";
import "../App.css";

const Divider = ({ large = false }) => (
  <div className="flex items-center justify-center gap-2 md:gap-3">
    <span
      className={`h-px bg-[#691700] ${large ? "w-12 md:w-16" : "w-8 md:w-12"}`}
    />
    <span
      className={`text-[#991D00] ${large ? "text-2xl md:text-3xl" : "text-sm md:text-base"}`}
    >
      {large ? "♥" : "✦"}
    </span>
    <span
      className={`h-px bg-[#691700] ${large ? "w-12 md:w-16" : "w-8 md:w-12"}`}
    />
  </div>
);

const ChevronIcon = ({ open }) => (
  <svg
    className={`text-[#691700] transition-transform duration-200 flex-shrink-0 ${open ? "rotate-180" : ""}`}
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
);

const WeddingLogistics = () => {
  const { width, height } = useWindowSize();
  const [showConfetti, setShowConfetti] = useState(true);
  const [confettiOpacity, setConfettiOpacity] = useState(1);

  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [memberNames, setMemberNames] = useState([]);
  const [memberIds, setMemberIds] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [dietary, setDietary] = useState({});
  const [existingRsvpIds, setExistingRsvpIds] = useState({});
  const [guestDocId, setGuestDocId] = useState(null);
  const [guestCountFromDoc, setGuestCountFromDoc] = useState(1);
  const [isDraftResume, setIsDraftResume] = useState(false);

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
    setMemberNames([]);
    setMemberIds([]);
    setAttendance({});
    setDietary({});
    setExistingRsvpIds({});
    setGuestDocId(null);
    setGuestCountFromDoc(1);
    setIsDraftResume(false);
  };

  const handleClose = () => {
    if (step === 3 && !submitted) {
      setShowCloseConfirm(true);
      return;
    }
    setShowModal(false);
    resetModal();
  };

  const handleConfirmClose = async (save) => {
    setShowCloseConfirm(false);
    if (save) await handleSave();
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
    const guestCount =
      data.guestCount ??
      (Array.isArray(data.partyMembers) ? data.partyMembers.length : 0) + 1;
    const rawParty = Array.isArray(data.partyMembers) ? data.partyMembers : [];
    const rawPartyIds = Array.isArray(data.partyMemberIds)
      ? data.partyMemberIds
      : [];

    const names = [self];
    const ids = [data.guestId ?? null];
    for (let i = 0; i < guestCount - 1; i++) {
      const val = rawParty[i];
      names.push(val ? val.toLowerCase() : "");
      ids.push(rawPartyIds[i] ?? null);
    }

    const namedIds = ids.filter((id, i) => id && names[i].trim());
    const existingRsvps = await lookupExistingRsvps(namedIds);

    const emptyEvents = Object.fromEntries(EVENTS.map((e) => [e.key, null]));
    const att = {};
    const diet = {};
    names.forEach((name, i) => {
      att[i] = { ...emptyEvents };
      diet[i] = "";
      const guestId = ids[i];
      if (guestId && existingRsvps[guestId]) {
        EVENTS.forEach((e) => {
          if (existingRsvps[guestId].events?.[e.key] !== undefined)
            att[i][e.key] = existingRsvps[guestId].events[e.key];
        });
        diet[i] = existingRsvps[guestId].dietaryRestrictions ?? "";
      }
    });

    const idsByIndex = {};
    names.forEach((_, i) => {
      const guestId = ids[i];
      if (guestId && existingRsvps[guestId])
        idsByIndex[i] = existingRsvps[guestId].id;
    });

    setGuestDocId(matchedDoc.id);
    setGuestCountFromDoc(guestCount);
    setMemberNames(names);
    setMemberIds(ids);
    setAttendance(att);
    setDietary(diet);
    setExistingRsvpIds(idsByIndex);
    const hasDraft = Object.values(existingRsvps).some((r) => r.isDraft);
    const hasExisting = Object.keys(existingRsvps).length > 0;
    setIsDraftResume(hasDraft);
    setStep(hasExisting ? 2 : 3);
  };

  const handleAttendanceChange = (index, eventKey, value) => {
    setAttendance((prev) => ({
      ...prev,
      [index]: { ...prev[index], [eventKey]: value },
    }));
  };

  const handleNameChange = (index, value) => {
    setMemberNames((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const allAnswered = () =>
    memberNames.every((name, i) => {
      if (!name.trim()) return true;
      return EVENTS.every(
        (e) =>
          attendance[i]?.[e.key] !== null &&
          attendance[i]?.[e.key] !== undefined,
      );
    });

  const buildRsvpPayload = (isDraft, ids = memberIds) => {
    const submittedBy = `${firstName.trim()} ${lastName.trim()}`.toLowerCase();
    const parsed = phoneNumber ? parsePhoneNumber(phoneNumber) : null;
    const formattedPhone = parsed
      ? `+${parsed.countryCallingCode} ${parsed.nationalNumber}`
      : phoneNumber;

    const memberRsvps = memberNames
      .map((name, i) => ({
        name: name.trim().toLowerCase(),
        guestId: ids[i],
        i,
      }))
      .filter(({ name }) => name)
      .map(({ name, guestId, i }) => ({
        name,
        guestId,
        events: EVENTS.reduce(
          (acc, e) => ({
            ...acc,
            [e.key]: isDraft
              ? (attendance[i]?.[e.key] ?? null)
              : attendance[i][e.key],
          }),
          {},
        ),
        dietaryRestrictions: dietary[i]?.trim() || "",
        submittedBy,
        phoneNumber: formattedPhone,
      }));

    const existingIdsByGuestId = {};
    memberNames.forEach((name, i) => {
      if (name.trim() && ids[i] && existingRsvpIds[i])
        existingIdsByGuestId[ids[i]] = existingRsvpIds[i];
    });

    return { submittedBy, formattedPhone, memberRsvps, existingIdsByGuestId };
  };

  const persistGuestData = async () => {
    if (!guestDocId) return memberIds;

    const updatedIds = [...memberIds];
    await Promise.all(
      memberNames.slice(1).map(async (rawName, relIdx) => {
        const name = rawName.trim();
        const slotIdx = relIdx + 1;
        if (!name || updatedIds[slotIdx]) return;
        const parts = name.split(" ");
        const fn = parts[0];
        const ln = parts.length > 1 ? parts.slice(1).join(" ") : "";
        updatedIds[slotIdx] = await upsertGuestForMember(
          fn,
          ln,
          guestCountFromDoc,
        );
      }),
    );

    const updatedPartyNames = memberNames
      .slice(1)
      .map((n) => n.trim().toLowerCase() || null);
    const updatedPartyIds = updatedIds.slice(1).map((id) => id ?? null);
    await updateGuestPartyMembers(
      guestDocId,
      updatedPartyNames,
      updatedPartyIds,
    );

    setMemberIds(updatedIds);
    return updatedIds;
  };

  const handleSubmit = async () => {
    if (!allAnswered()) {
      setError("Please select attendance for every event and party member.");
      return;
    }
    setError("");
    setSubmitting(true);

    const finalIds = await persistGuestData();
    const { submittedBy, formattedPhone, memberRsvps, existingIdsByGuestId } =
      buildRsvpPayload(false, finalIds);
    await saveRsvps(memberRsvps, existingIdsByGuestId);
    notifyGoogleSheets({
      submittedBy,
      phoneNumber: formattedPhone,
      members: memberRsvps,
    });

    setSubmitting(false);
    setSubmitted(true);
  };

  const handleSave = async () => {
    const finalIds = await persistGuestData();
    const { memberRsvps, existingIdsByGuestId } = buildRsvpPayload(
      true,
      finalIds,
    );
    await saveRsvps(memberRsvps, existingIdsByGuestId, true);
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

      {/* Close confirmation dialog */}
      {showCloseConfirm && (
        <div className="fixed inset-0 bg-black/40 z-[60] flex items-center justify-center px-4">
          <div className="bg-[#faf0e6] rounded-xl px-8 py-8 w-full max-w-sm flex flex-col items-center gap-5 shadow-xl">
            <p className="font-prata text-lg text-[#1a1a1a] text-center leading-relaxed">
              Are you sure you'd like to close?
            </p>
            <p className="font-prata text-sm text-[#5a5a5a] text-center -mt-2">
              Your progress will be saved!
            </p>
            <div className="flex gap-3 w-full">
              <button
                onClick={() => setShowCloseConfirm(false)}
                className="flex-1 font-prata text-[#691700] border border-[#691700]/30 px-3 py-2 rounded-lg transition-all duration-200 hover:border-[#691700] cursor-pointer"
              >
                No, stay
              </button>
              <button
                onClick={() => handleConfirmClose(true)}
                className="flex-1 font-prata text-lg text-white bg-[#691700] px-3 py-2 rounded-lg transition-all duration-200 hover:bg-[#4a1000] cursor-pointer"
              >
                Yes, close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RSVP Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4 py-8"
          onClick={handleClose}
        >
          <div
            className="bg-[#faf0e6] rounded-xl px-6 md:px-8 py-8 w-full max-w-xl flex flex-col items-center gap-5 shadow-xl max-h-[90vh] overflow-y-auto animate-fade-in md:py-12"
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
            {step === 2 && !submitted && isDraftResume && (
              <ModalDraftResume
                firstName={firstName}
                lastName={lastName}
                onContinue={() => {
                  setIsDraftResume(false);
                  setStep(3);
                }}
                onClose={handleClose}
              />
            )}
            {step === 2 && !submitted && !isDraftResume && (
              <ModalStep2
                firstName={firstName}
                lastName={lastName}
                onModify={() => setStep(3)}
                onClose={handleClose}
              />
            )}
            {step === 3 && !submitted && (
              <ModalStep3
                memberNames={memberNames}
                attendance={attendance}
                dietary={dietary}
                error={error}
                submitting={submitting}
                onAttendanceChange={handleAttendanceChange}
                onDietaryChange={(index, val) =>
                  setDietary((prev) => ({ ...prev, [index]: val }))
                }
                onNameChange={handleNameChange}
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
          <div className="absolute inset-0 bg-[#691700] rounded-lg transform rotate-3" />
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
        <div className="font-prata text-[#5a5a5a] text-sm md:text-base lg:text-lg mt-2 space-y-2 md:space-y-3">
          <p className="leading-relaxed">
            Please note that we have secured a heavily discounted room rate for
            our guests from May 31 through June 7, 2027.
          </p>
          <p className="leading-relaxed">
            Per venue policy, the RSVP must be made using the link displayed
            after submitting the form below.
          </p>
          <p className="leading-relaxed">
            We appreciate your understanding and can't wait to celebrate with
            you!
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
              <ChevronIcon open={openDays.has(day.key)} />
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
