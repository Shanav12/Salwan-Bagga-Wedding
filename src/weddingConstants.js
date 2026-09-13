export const EVENTS = [
  { key: "haldi", label: "Ganesh Pooja & Haldi", date: "June 3 — Thursday" },
  { key: "sangeet", label: "Sangeet", date: "June 3 — Thursday" },
  { key: "baraat", label: "Baraat", date: "June 4 — Friday" },
  { key: "weddingCeremony", label: "Wedding Ceremony", date: "June 4 — Friday" },
  { key: "cocktailDinner", label: "Cocktail & Dinner", date: "June 4 — Friday" },
  { key: "cocktailHour", label: "Cocktail Hour", date: "June 5 — Saturday" },
  { key: "dinner", label: "Dinner", date: "June 5 — Saturday" },
];

export const EVENT_DAYS_RSVP = [
  {
    label: "June 3 — Thursday",
    events: [
      { key: "haldi", label: "Ganesh Pooja & Haldi" },
      { key: "sangeet", label: "Sangeet" },
    ],
  },
  {
    label: "June 4 — Friday",
    events: [
      { key: "baraat", label: "Baraat" },
      { key: "weddingCeremony", label: "Wedding Ceremony" },
      { key: "cocktailDinner", label: "Cocktail & Dinner" },
    ],
  },
  {
    label: "June 5 — Saturday",
    events: [
      { key: "cocktailHour", label: "Cocktail Hour" },
      { key: "dinner", label: "Dinner" },
    ],
  },
];

export const EVENT_DAYS = [
  {
    key: "june3",
    label: "June 3",
    weekday: "Thursday",
    events: [
      { time: "10:00 am", name: "Ganesh Pooja and Haldi", location: "Retune Terrace" },
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
      { time: "7:00 pm", name: "Cocktail & Dinner", location: "Moonlight Terrace" },
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

export const HOTEL_URL = "https://www.shaadidestinations.com/ambika-and-sahil";

export const NAME_ROLES = {
  "shanav bagga": "Best Man",
  "sahil bagga": "Groom",
  "chandan bagga": "Father of the Groom",
  "ambika salwan": "Bride",
  "sia salwan": "Maid of Honor",
  "arun salwan": "Father of the Bride",
  "priyanka salwan": "Mother of the Bride",
};

export const toTitleCase = (str) => str.replace(/\b\w/g, (c) => c.toUpperCase());

export const initAttendance = (members) =>
  Object.fromEntries(
    members.map((m) => [
      m,
      Object.fromEntries(EVENTS.map((e) => [e.key, null])),
    ]),
  );
