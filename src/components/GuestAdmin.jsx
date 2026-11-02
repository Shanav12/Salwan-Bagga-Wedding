import { useState, useRef, useEffect } from "react";
import { addGuest } from "../api/guests";

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
const labelClass =
  "block font-prata text-xs uppercase tracking-widest text-[#5a5a5a] mb-1.5";

const Select = ({ value, onChange, options, placeholder }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center justify-between border rounded-lg px-4 py-2.5 font-prata text-sm bg-[#fdfbf7] focus:outline-none transition-colors ${
          open ? "border-[#691700]" : "border-[#691700]/30"
        } ${value ? "text-[#1a1a1a]" : "text-[#9a8070]"}`}
      >
        {value || placeholder}
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

const EMPTY = { firstName: "", lastName: "", guestCount: "" };

function AddGuestForm({ onAdd }) {
  const [form, setForm] = useState(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  const setVal = (field) => (val) => setForm((f) => ({ ...f, [field]: val }));

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!form.firstName.trim() || !form.lastName.trim() || !form.guestCount) {
      setError("Please fill out all required fields.");
      return;
    }
    setSubmitting(true);
    try {
      await onAdd({ ...form, guestCount: Number(form.guestCount) });
      setForm(EMPTY);
    } catch (err) {
      setError(err.message ?? "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-6 bg-[#f5f2ee]/80 rounded-xl border border-[#691700]/30 px-6 py-8 md:px-10 md:py-10"
    >
      <h2 className="font-prata text-2xl text-[#4a4a4a] text-center">Add a Guest</h2>

      <div>
        <label className={labelClass}>First Name</label>
        <input required type="text" placeholder="e.g. priya" value={form.firstName} onChange={set("firstName")} className={inputClass} />
      </div>

      <div>
        <label className={labelClass}>Last Name</label>
        <input required type="text" placeholder="e.g. sharma" value={form.lastName} onChange={set("lastName")} className={inputClass} />
      </div>

      <div>
        <label className={labelClass}>Guest Count</label>
        <Select
          value={form.guestCount}
          onChange={setVal("guestCount")}
          placeholder="Select…"
          options={["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]}
        />
      </div>

      {error && <p className="font-prata text-sm text-red-700 text-center">{error}</p>}

      <div className="text-center">
        <button
          type="submit"
          disabled={submitting}
          className="font-prata text-lg text-white bg-[#691700] px-8 py-2 rounded-lg transition-all duration-200 hover:bg-[#4a1000] hover:-translate-y-0.5 disabled:opacity-50 cursor-pointer"
        >
          {submitting ? "Adding…" : "Add Guest"}
        </button>
      </div>
    </form>
  );
}

export default function GuestAdmin() {
  const [toast, setToast] = useState(null);

  function showToast(msg, type = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  async function handleAdd(form) {
    try {
      await addGuest(form.firstName, form.lastName, form.guestCount);
      showToast("Guest added!");
    } catch (e) {
      showToast(e.message ?? "Failed to add guest.", "error");
    }
  }

  return (
    <div className="min-h-full bg-[#faf0e6] pt-14 pb-10 px-4">
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-lg shadow-lg text-sm font-prata ${toast.type === "error" ? "bg-red-800 text-white" : "bg-[#691700] text-white"}`}>
          {toast.msg}
        </div>
      )}

      <div className="text-center mb-10">
        <h1 className="font-prata text-5xl md:text-6xl text-[#4a4a4a] mb-4">Guest Admin</h1>
        <Divider large />
        <p className="font-prata text-[#5a5a5a] text-sm md:text-base mt-6 max-w-md mx-auto leading-relaxed">
          Add guests to the wedding list.
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <AddGuestForm onAdd={handleAdd} />
      </div>
    </div>
  );
}
