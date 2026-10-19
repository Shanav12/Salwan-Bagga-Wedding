import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

const ROOMMATE_SHEETS_URL = "https://script.google.com/macros/s/AKfycbw1UO_plMZ2L9ZPOjHAlFLiwreeZz3x8OI0fAVZW1LYwtB3JqBRYlkOLBecgVHOMWHt/exec";

const SHEET_VIEW_URL = "https://docs.google.com/spreadsheets/d/16KI6iI3DC5gqxOGhdz-8ZvM_5mI2U3T139zV3OAzACA/edit?usp=sharing";

const Divider = ({ large = false }) => (
  <div className="flex items-center justify-center gap-2 md:gap-3">
    <span className={`h-px bg-[#691700] ${large ? "w-12 md:w-16" : "w-8 md:w-12"}`} />
    <span className={`text-[#991D00] ${large ? "text-2xl md:text-3xl" : "text-sm md:text-base"}`}>
      {large ? "♥" : "✦"}
    </span>
    <span className={`h-px bg-[#691700] ${large ? "w-12 md:w-16" : "w-8 md:w-12"}`} />
  </div>
);

const inputClass =
  "w-full border border-[#691700]/30 rounded-lg px-4 py-2.5 font-prata text-sm text-[#1a1a1a] bg-[#fdfbf7] focus:outline-none focus:border-[#691700]";

const labelClass = "block font-prata text-xs uppercase tracking-widest text-[#5a5a5a] mb-1.5";

const Select = ({ value, onChange, options, placeholder }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selected = options.find((o) => o === value);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center justify-between border rounded-lg px-4 py-2.5 font-prata text-sm bg-[#fdfbf7] focus:outline-none transition-colors ${
          open ? "border-[#691700]" : "border-[#691700]/30"
        } ${value ? "text-[#1a1a1a]" : "text-[#9a8070]"}`}
      >
        {selected || placeholder}
        <svg
          className={`text-[#691700] transition-transform duration-200 flex-shrink-0 ${open ? "rotate-180" : ""}`}
          width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <ul className="absolute z-20 mt-1 w-full bg-[#fdfbf7] border border-[#691700]/30 rounded-lg shadow-md overflow-hidden">
          {options.map((o) => (
            <li
              key={o}
              onClick={() => { onChange(o); setOpen(false); }}
              className={`px-4 py-2.5 font-prata text-sm cursor-pointer transition-colors hover:bg-[#f0e8e0] ${
                value === o ? "text-[#691700] bg-[#f5ede5]" : "text-[#1a1a1a]"
              }`}
            >
              {o}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default function RoommateForm() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    peopleHave: "",
    peopleCount: "",
    side: "",
    notes: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  const setVal = (field) => (val) => setForm((f) => ({ ...f, [field]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim() || !form.phone.trim() || !form.peopleHave || !form.peopleCount || !form.side) {
      setError("Please fill out all required fields.");
      return;
    }

    setLoading(true);
    try {
      await fetch(ROOMMATE_SHEETS_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify({
          name: form.name.trim(),
          phone: form.phone.trim(),
          peopleHave: form.peopleHave,
          peopleCount: form.peopleCount,
          side: form.side,
          notes: form.notes.trim(),
        }),
      });
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full bg-[#faf0e6] pt-14 pb-4 px-4">
      <div className="text-center mb-10">
        <h1 className="font-prata text-5xl md:text-6xl text-[#4a4a4a] mb-4">
          Roommate Finder
        </h1>
        <Divider large />
        <p className="font-prata text-[#5a5a5a] text-sm md:text-base mt-6 max-w-md mx-auto leading-relaxed">
          Looking to share a hotel room? Fill out the form below and we'll add
          you to the list so other guests can connect with you!
        </p>
      </div>

      <div className="max-w-xl mx-auto">
        {submitted ? (
          <section className="text-center bg-[#f5f2ee]/80 rounded-xl border border-[#691700]/30 px-6 py-10 md:px-10">
            <h2 className="font-prata text-3xl text-[#4a4a4a] mb-3">
              You're on the list!
            </h2>
            <Divider />
            <p className="font-prata text-[#5a5a5a] text-sm md:text-base mt-6 mb-8 leading-relaxed">
              Your entry has been submitted. View the full list below to connect
              with other guests looking to share a room.
            </p>
            <a
              href={SHEET_VIEW_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block font-prata text-lg text-white bg-[#691700] px-6 py-2 rounded-lg transition-all duration-200 hover:bg-[#4a1000] hover:-translate-y-0.5"
            >
              View Roommate List
            </a>
            <div className="mt-6">
              <Link to="/" className="font-prata text-md text-[#5a5a5a] underline hover:text-[#691700] transition-colors">
                Back to Homepage
              </Link>
            </div>
          </section>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6 bg-[#f5f2ee]/80 rounded-xl border border-[#691700]/30 px-6 py-8 md:px-10 md:py-10">
            <div>
              <label className={labelClass}>Your Name</label>
              <input
                type="text"
                placeholder="First and last name"
                value={form.name}
                onChange={set("name")}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Phone Number</label>
              <input
                type="tel"
                placeholder="e.g. 555-867-5309"
                value={form.phone}
                onChange={set("phone")}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>People You Already Have</label>
              <Select
                value={form.peopleHave}
                onChange={setVal("peopleHave")}
                placeholder="Select…"
                options={["1", "2", "3", "4", "5"]}
              />
            </div>

            <div>
              <label className={labelClass}>People You're Looking For</label>
              <Select
                value={form.peopleCount}
                onChange={setVal("peopleCount")}
                placeholder="Select…"
                options={["1", "2", "3", "4", "5"]}
              />
            </div>

            <div>
              <label className={labelClass}>Wedding Side</label>
              <div className="flex gap-6 mt-1">
                {["Salwan", "Bagga"].map((side) => (
                  <label key={side} className="flex items-center gap-2.5 cursor-pointer font-prata text-sm text-[#1a1a1a]">
                    <input
                      type="radio"
                      name="side"
                      value={side}
                      checked={form.side === side}
                      onChange={set("side")}
                      className="accent-[#691700] w-4 h-4"
                    />
                    {side} Side
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className={labelClass}>
                Anything else?{" "}
                <span className="normal-case tracking-normal">(optional)</span>
              </label>
              <textarea
                rows={3}
                placeholder="Preferences, contact info, budget range, etc."
                value={form.notes}
                onChange={set("notes")}
                className={`${inputClass} resize-none`}
              />
            </div>

            {error && (
              <p className="font-prata text-sm text-red-700 text-center">{error}</p>
            )}

            <div className="text-center">
              <button
                type="submit"
                disabled={loading}
                className="font-prata text-lg text-white bg-[#691700] px-6 py-2 rounded-lg transition-all duration-200 hover:bg-[#4a1000] hover:-translate-y-0.5 disabled:opacity-50 cursor-pointer"
              >
                {loading ? "Submitting…" : "Submit"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
