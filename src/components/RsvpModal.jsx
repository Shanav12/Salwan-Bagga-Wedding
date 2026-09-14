import PhoneInput from "react-phone-number-input";
import { useState } from "react";
import "react-phone-number-input/style.css";
import {
  EVENTS,
  EVENT_DAYS_RSVP,
  HOTEL_URL,
  NAME_ROLES,
  toTitleCase,
} from "../weddingConstants";

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

const ChevronIcon = ({ open }) => (
  <svg
    className={`text-[#691700] transition-transform duration-200 flex-shrink-0 ${open ? "rotate-180" : ""}`}
    width="13"
    height="13"
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
      Attending
    </button>
    <button
      onClick={() => onChange(false)}
      className={`flex-1 font-prata text-xs px-3 py-2 rounded-lg border transition-all duration-150 cursor-pointer ${
        value === false
          ? "bg-[#691700]/85 text-white border-[#691700]/85"
          : "bg-white text-[#4a4a4a] border-[#691700]/30 hover:border-[#691700]"
      }`}
    >
      Can't make it
    </button>
  </div>
);

export const ModalStep1 = ({
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

export const ModalStep2 = ({ firstName, lastName, onModify, onClose }) => {
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
          onClick={() => window.open(HOTEL_URL, "_blank", "noopener,noreferrer")}
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

export const ModalStep3 = ({
  memberNames,
  attendance,
  dietary,
  error,
  submitting,
  onAttendanceChange,
  onDietaryChange,
  onNameChange,
  onSubmit,
  onClose,
}) => {
  const makeKey = (slotIdx, dayIdx) => `${slotIdx}:${dayIdx}`;
  const [openDays, setOpenDays] = useState(() => {
    const keys = memberNames.flatMap((_, slotIdx) =>
      EVENT_DAYS_RSVP.map((_, dayIdx) => makeKey(slotIdx, dayIdx)),
    );
    return new Set(keys);
  });

  const toggleDay = (slotIdx, dayIdx) => {
    const key = makeKey(slotIdx, dayIdx);
    setOpenDays((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  return (
    <>
      <h3 className="font-prata text-2xl text-[#691700] text-center">
        Party RSVP
      </h3>
      <p className="font-prata text-[#5a5a5a] text-sm text-center leading-relaxed">
        Let us know who from your party will be attending each event!
      </p>

      <div className="flex flex-col gap-10 w-full">
        {memberNames.map((name, slotIdx) => {
          const displayName = name ? toTitleCase(name) : `Guest ${slotIdx + 1}`;
          return (
            <div key={slotIdx} className="flex flex-col gap-4">
              <div className="border-b border-[#691700]/20 pb-2">
                {slotIdx > 0 ? (
                  <div className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-[#691700]/50 flex-shrink-0"
                    >
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                    <input
                      type="text"
                      placeholder={`Guest ${slotIdx + 1} Full Name`}
                      value={name}
                      onChange={(e) => onNameChange(slotIdx, e.target.value)}
                      className="font-prata text-lg text-[#1a1a1a] bg-transparent border-none border-b border-[#691700]/30 outline-none w-full placeholder:text-[#aaa] focus:border-b focus:border-[#691700] transition-colors"
                    />
                  </div>
                ) : (
                  <h4 className="font-prata text-lg text-[#1a1a1a]">
                    {displayName}
                  </h4>
                )}
                {name && NAME_ROLES[name.toLowerCase()] && (
                  <span className="font-prata text-xs text-[#691700]">
                    {NAME_ROLES[name.toLowerCase()]}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                {EVENT_DAYS_RSVP.map((day, dayIdx) => (
                  <div
                    key={dayIdx}
                    className="rounded-lg border border-[#691700]/15 overflow-hidden"
                  >
                    <button
                      onClick={() => toggleDay(slotIdx, dayIdx)}
                      className="w-full flex items-center justify-between px-4 py-3 bg-[#691700]/5 hover:bg-[#691700]/10 transition-colors cursor-pointer"
                    >
                      <span className="font-prata text-sm text-[#691700]">
                        {day.label}
                      </span>
                      <ChevronIcon open={openDays.has(makeKey(slotIdx, dayIdx))} />
                    </button>

                    {openDays.has(makeKey(slotIdx, dayIdx)) && (
                      <div className="flex flex-col gap-3 px-4 py-3">
                        {day.events.map((event) => (
                          <div key={event.key} className="flex flex-col gap-1.5">
                            <span className="font-prata text-sm text-[#1a1a1a]">
                              {event.label}
                            </span>
                            <AttendanceToggle
                              value={attendance[slotIdx]?.[event.key]}
                              onChange={(val) =>
                                onAttendanceChange(slotIdx, event.key, val)
                              }
                            />
                          </div>
                        ))}
                      </div>
                    )}
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
                  value={dietary[slotIdx] ?? ""}
                  onChange={(e) => onDietaryChange(slotIdx, e.target.value)}
                  className="font-prata text-sm text-[#4a4a4a] bg-white border border-[#691700]/30 rounded-lg px-4 py-2.5 outline-none focus:border-[#691700] transition-colors placeholder:text-[#aaa] w-full resize-none"
                />
              </div>
            </div>
          );
        })}
      </div>

      {error && (
        <p className="font-prata text-[#691700] text-sm text-center">{error}</p>
      )}

      <div className="flex gap-3 w-full">
        <SecondaryButton onClick={onClose} className="flex-1">
          Cancel
        </SecondaryButton>
        <PrimaryButton onClick={onSubmit} disabled={submitting} className="flex-1">
          {submitting ? "Submitting…" : "Submit RSVP"}
        </PrimaryButton>
      </div>
    </>
  );
};

export const ModalDraftResume = ({ firstName, lastName, onContinue, onClose }) => {
  const fullKey = `${firstName.trim()} ${lastName.trim()}`.toLowerCase();
  const displayName = NAME_ROLES[fullKey] ?? toTitleCase(firstName);
  return (
    <>
      <h3 className="font-prata text-2xl text-[#691700] text-center">
        Welcome Back!
      </h3>
      <div className="font-prata text-[#5a5a5a] text-sm md:text-base text-center leading-relaxed space-y-3">
        <p>Hi {displayName}! We see that you have a draft RSVP saved.</p>
        <p>Press continue to proceed from where you left off!</p>
      </div>
      <div className="flex gap-3 w-full">
        <SecondaryButton onClick={onClose} className="flex-1">
          Cancel
        </SecondaryButton>
        <PrimaryButton onClick={onContinue} className="flex-1">
          Continue
        </PrimaryButton>
      </div>
    </>
  );
};

export const ModalConfirmation = ({ onClose }) => (
  <>
    <h3 className="font-prata text-2xl text-[#691700] text-center">
      Thank You!
    </h3>
    <div className="font-prata text-center leading-relaxed space-y-2">
      <p className="text-[#5a5a5a] text-sm md:text-base">Your RSVP has been received. You can come back and modify it.</p>
      <p className="text-[#5a5a5a] text-md opacity-80">We can&apos;t wait to celebrate with you!</p>
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
