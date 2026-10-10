# Salwan-Bagga Wedding Website

The official wedding website for **Ambika Salwan & Sahil Bagga**. Built with React + Vite and deployed to GitHub Pages via a custom domain.

---

## Features

| Page                  | Description                                                                     |
| --------------------- | ------------------------------------------------------------------------------- |
| **Home**              | Save-the-date card, countdown timer, and our story section.                     |
| **Journey**           | Photo timeline of Ambika & Sahil's relationship story                           |
| **Gallery**           | Photo gallery with full-screen lightbox                                         |
| **Wedding Logistics** | Event schedule across all three days with times and venue locations             |
| **Lineup**            | Wedding party profiles                                                          |
| **Quiz**              | Interactive trivia game about the couple                                        |
| **RSVP**              | Modal-based RSVP flow. guest lookup, per-event attendance, dietary restrictions |

---

## Tech Stack

| Layer              | Technology                                                   |
| ------------------ | ------------------------------------------------------------ |
| UI framework       | React 19                                                     |
| Build tool         | Vite 7                                                       |
| Styling            | Tailwind CSS 4                                               |
| Routing            | React Router v7 (hash-based, for GitHub Pages compatibility) |
| Backend / DB       | Firebase Firestore                                           |
| RSVP notifications | Google Apps Script webhook → Google Sheets                   |
| Deployment         | GitHub Pages                                    |
| Testing            | Vitest + React Testing Library                               |

---

## Project Structure

```
.
├── src/
│   ├── api/
│   │   ├── rsvp.js          # Firestore RSVP read/write + Google Sheets webhook
│   │   ├── gallery.js       # Gallery image fetching
│   │   ├── quiz.js          # Quiz question fetching
│   │   └── test/
│   │       └── rsvp.test.js
│   ├── components/
│   │   ├── Home.jsx         # Landing page with countdown
│   │   ├── Journey.jsx      # Couple's story timeline
│   │   ├── Gallery.jsx      # Photo gallery with lightbox
│   │   ├── WeddingLogistics.jsx  # Schedule / venue info + RSVP modal host
│   │   ├── Lineup.jsx       # Wedding party
│   │   ├── Quiz.jsx         # Trivia game
│   │   ├── RsvpModal.jsx    # Multi-step RSVP form steps
│   │   ├── NavBar.jsx       # Top navigation
│   │   ├── MusicPlayer.jsx  # Floating background music player
│   │   ├── EventCard.jsx    # Reusable event card
│   │   └── test/            # Component tests + helpers
│   ├── contexts/
│   │   ├── GalleryContext.jsx
│   │   └── GalleryProvider.jsx
│   ├── assets/              # Images, audio files
│   ├── App.jsx              # Root component, routes, splash screen
│   ├── firebase_config.js   # Firebase initialization
│   ├── weddingConstants.js  # Event schedule, hotel URL, name-role map
│   ├── main.jsx             # App entry point
│   └── index.css
├── docs/
│   ├── rsvp-data-model.md   # Firestore schema documentation
│   ├── rsvp-data-model.puml # PlantUML ERD source
│   └── rsvp-data-model.png  # ERD diagram
├── public/
│   ├── CNAME                # Custom domain config for GitHub Pages
│   └── heart.png
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

---

## RSVP System

RSVPs are stored in **Firebase Firestore** with two collections:

**`guests`** — pre-seeded list of invited guests:
- `guestId` — UUID used as the foreign key across collections (distinct from the Firestore doc ID)

- `firstName`, `lastName` (lowercase)
- `phoneNumber` (optional, used to disambiguate guests with the same name)
- `guestCount` — total party size including self
- `partyMemberIds` — array of `guestId` values for each party member (`guestCount - 1` slots); `null` until their guest doc is created

**`rsvps`** — one document per person (one per party member, including the party head):

- `guestId` — references `guests.guestId`
- `name` — lowercase full name of this party member
- `submittedBy` — party head who filled out the form
- `phoneNumber`, `dietaryRestrictions`
- `events` — flat map of event keys → `true | false | null` (`null` valid in drafts only)
- `submittedAt` — Firestore server timestamp
- `isDraft` — `true` while navigating, `false` on final submit

On final submission a fire-and-forget POST is sent to a **Google Apps Script** webhook that writes to a Google Sheet.

See [`docs/rsvp-data-model.md`](docs/rsvp-data-model.md) for the full ERD and schema details.

### Events

| Key               | Label                | Date         | Time     | Venue             |
| ----------------- | -------------------- | ------------ | -------- | ----------------- |
| `haldi`           | Ganesh Pooja & Haldi | June 3 — Thu | 10:00 am | Retune Terrace    |
| `sangeet`         | Sangeet              | June 3 — Thu | 5:30 pm  | Serenade Terrace  |
| `baraat`          | Baraat               | June 4 — Fri | 3:00 pm  | —                 |
| `weddingCeremony` | Wedding Ceremony     | June 4 — Fri | 4:00 pm  | Coda Gardens      |
| `cocktailDinner`  | Cocktail & Dinner    | June 4 — Fri | 7:00 pm  | Moonlight Terrace |
| `cocktailHour`    | Cocktail Hour        | June 5 — Sat | 6:00 pm  | Harmony Ballroom  |
| `dinner`          | Dinner               | June 5 — Sat | 7:30 pm  | Harmony Ballroom  |

---

## Prerequisites

- **Node.js 20+** (Node 22 recommended)

To install Node 22 via nvm:

```bash
brew install nvm
source ~/.bashrc
nvm install 22
nvm use 22
node --version  # should print v22.x.x
```

## Getting Started

1. **Clone the repo**

---

## Development

```bash
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

## Available Scripts

Run all scripts from the `src/` directory.

| Script               | Description                                    |
| -------------------- | ---------------------------------------------- |
| `npm run dev`        | Start the Vite dev server with hot reload      |
| `npm run build`      | Build the app for production (output: `dist/`) |
| `npm run preview`    | Locally preview the production build           |
| `npm run deploy`     | Build and deploy to GitHub Pages               |
| `npm test`           | Run the test suite once                        |
| `npm run test:watch` | Run tests in watch mode                        |

## Deployment

The site deploys to GitHub Pages via the `gh-pages` package. The `predeploy` script automatically runs a production build before pushing.

```bash
npm run deploy
```

This builds the project into `dist/` and pushes it to the `gh-pages` branch.

## Firebase Configuration

Firebase is used for Firestore (RSVP data) and Storage (gallery images). The `src/firebase_config.js` file initializes the Firebase app. Ensure your Firebase project has Firestore and Storage enabled, and update the config object with your project credentials before running locally.
