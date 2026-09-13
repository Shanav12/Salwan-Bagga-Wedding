# Salwan-Bagga Wedding

The official wedding website for **Sahil & Ambika's** wedding. Built as a single-page React application and deployed via GitHub Pages.

## Features

- **Home** — Our story section with a countdown timer and save-the-date visuals
- **Wedding Logistics** — Event details, venue info, and schedule for all ceremonies
- **The Lineup** — Wedding party profiles
- **Our Journey** — Photo timeline of the couple's story
- **Gallery** — Photo gallery with Firebase-backed storage
- **Quiz** — Interactive couples quiz with confetti celebrations
- **Music Player** — Background music player with curated tracks
- **RSVP** — Phone-number-based RSVP form backed by Firebase Firestore

## Tech Stack

| Layer | Technology |
|---|---|
| UI Framework | React 19 |
| Build Tool | Vite 7 |
| Styling | Tailwind CSS 4 |
| Routing | React Router DOM 7 |
| Backend / DB | Firebase (Firestore + Storage) |
| Testing | Vitest + Testing Library |
| Deployment | GitHub Pages via `gh-pages` |

## Prerequisites

- **Node.js 20+** (Node 22 recommended)
- **npm** (comes with Node)

### Installing Node via nvm (recommended)

Install nvm with Homebrew:

```bash
brew install nvm
```

Follow the post-install instructions Homebrew prints (add nvm to your shell profile), then:

```bash
nvm install 22
nvm use 22
node --version  # should print v22.x.x
```

## Getting Started

1. **Clone the repo**

   ```bash
   git clone https://github.com/Shanav12/Salwan-Bagga-Wedding.git
   cd Salwan-Bagga-Wedding
   ```

2. **Install dependencies**

   ```bash
   cd src
   npm install
   ```

3. **Start the dev server**

   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`.

## Available Scripts

Run all scripts from the `src/` directory.

| Script | Description |
|---|---|
| `npm run dev` | Start the Vite dev server with hot reload |
| `npm run build` | Build the app for production (output: `dist/`) |
| `npm run preview` | Locally preview the production build |
| `npm run deploy` | Build and deploy to GitHub Pages |
| `npm test` | Run the test suite once |
| `npm run test:watch` | Run tests in watch mode |

## Deployment

The site deploys to GitHub Pages via the `gh-pages` package. The `predeploy` script automatically runs a production build before pushing.

```bash
npm run deploy
```

This builds the project into `dist/` and pushes it to the `gh-pages` branch.

## Project Structure

```
Salwan-Bagga-Wedding/
├── src/
│   ├── api/              # API utilities (e.g. quiz data fetching)
│   ├── assets/           # Images, audio files
│   ├── components/       # Page-level and shared React components
│   │   ├── EventCard.jsx
│   │   ├── Gallery.jsx
│   │   ├── Home.jsx
│   │   ├── Journey.jsx
│   │   ├── Lineup.jsx
│   │   ├── MusicPlayer.jsx
│   │   ├── NavBar.jsx
│   │   ├── Quiz.jsx
│   │   └── WeddingLogistics.jsx
│   ├── contexts/         # React context providers (e.g. GalleryContext)
│   ├── test/             # Vitest test files
│   ├── App.jsx           # Root component and route definitions
│   ├── firebase_config.js
│   ├── main.jsx          # App entry point
│   └── index.css
├── public/
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

## Firebase Configuration

Firebase is used for Firestore (RSVP data) and Storage (gallery images). The `src/firebase_config.js` file initializes the Firebase app. Ensure your Firebase project has Firestore and Storage enabled, and update the config object with your project credentials before running locally.