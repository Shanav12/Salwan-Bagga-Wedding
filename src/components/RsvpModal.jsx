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
  partyMembers,
  attendance,
  dietary,
  error,
  submitting,
  onAttendanceChange,
  onDietaryChange,
  onSubmit,
  onClose,
}) => {
  const makeKey = (member, idx) => `${member}:${idx}`;
  const [openDays, setOpenDays] = useState(() => {
    const keys = partyMembers.flatMap((m) =>
      EVENT_DAYS_RSVP.map((_, idx) => makeKey(m, idx)),
    );
    return new Set(keys);
  });

  const toggleDay = (member, idx) => {
    const key = makeKey(member, idx);
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

            <div className="flex flex-col gap-2">
              {EVENT_DAYS_RSVP.map((day, idx) => (
                <div
                  key={idx}
                  className="rounded-lg border border-[#691700]/15 overflow-hidden"
                >
                  <button
                    onClick={() => toggleDay(member, idx)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-[#691700]/5 hover:bg-[#691700]/10 transition-colors cursor-pointer"
                  >
                    <span className="font-prata text-sm text-[#691700]">
                      {day.label}
                    </span>
                    <ChevronIcon open={openDays.has(makeKey(member, idx))} />
                  </button>

                  {openDays.has(makeKey(member, idx)) && (
                    <div className="flex flex-col gap-3 px-4 py-3">
                      {day.events.map((event) => (
                        <div key={event.key} className="flex flex-col gap-1.5">
                          <span className="font-prata text-sm text-[#1a1a1a]">
                            {event.label}
                          </span>
                          <AttendanceToggle
                            value={attendance[member]?.[event.key]}
                            onChange={(val) =>
                              onAttendanceChange(member, event.key, val)
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
        <PrimaryButton onClick={onSubmit} disabled={submitting} className="flex-1">
          {submitting ? "Submitting…" : "Submit RSVP"}
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
