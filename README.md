x Skill Exchange

A full-stack platform where users can list skills they can teach ("helpers"), browse and book sessions with others ("seekers"), pay for paid listings via Razorpay, chat in real time, leave reviews, and get AI-generated skill descriptions via Gemini. Includes an admin dashboard for moderating listings.

**Stack:** React (Vite + Chakra UI) frontend · Node/Express + MongoDB backend · Socket.IO for real-time updates · Razorpay for payments · Google Gemini for AI text generation · Google OAuth for login.

---

## 1. Project Structure

```
project/
├── backend/           # Express API, MongoDB models, sockets
├── frontend/          # React (Vite) client
└── docker-compose.yml # Runs both together
```

---

## 2. Prerequisites

- Node.js 20+ and npm
- A MongoDB database (local or a free MongoDB Atlas cluster)
- A [Razorpay](https://razorpay.com/) account (test mode is fine)
- A [Google Cloud OAuth 2.0 Client](https://console.cloud.google.com/apis/credentials) (for "Sign in with Google")
- A [Google Gemini API key](https://aistudio.google.com/apikey) (for AI-generated skill descriptions)
- Docker + Docker Compose (optional, only if you want to run via containers)

---

## 3. ⚠️ Things You Need to Fill In

There is no `.env` file included in this export — you must create one for the backend (and optionally one for the frontend). Nothing will run without this.

### 3.1 Create `backend/.env`

Create a file at `backend/.env` with the following keys:

| Variable | Required | Description | Where to get it |
|---|---|---|---|
| `PORT` | No (defaults to `8000`) | Port the API server runs on | Your choice |
| `MONGO_URI` | **Yes** | MongoDB connection string | MongoDB Atlas dashboard, or `mongodb://localhost:27017/skill-exchange` for local |
| `JWT_SECRET` | **Yes** | Secret used to sign/verify login tokens | Make up any long random string, e.g. run `openssl rand -hex 32` |
| `SESSION_SECRET` | **Yes** | Secret for the Express session (used during Google OAuth handshake) | Same as above — another random string |
| `CLIENT_URL` | **Yes** | The URL of your running frontend (used for CORS, OAuth redirect, and socket CORS) | e.g. `http://localhost:5173` in dev, or your deployed frontend URL |
| `GOOGLE_CLIENT_ID` | **Yes** (for Google login) | OAuth Client ID | [Google Cloud Console → Credentials](https://console.cloud.google.com/apis/credentials) |
| `GOOGLE_CLIENT_SECRET` | **Yes** (for Google login) | OAuth Client Secret | Same as above |
| `GOOGLE_CALLBACK_URL` | **Yes** (for Google login) | Must match the authorized redirect URI you set in Google Cloud | e.g. `http://localhost:8000/api/auth/google/callback` — check `backend/routes/auth.route.js` for the exact path |
| `RAZORPAY_KEY_ID` | **Yes** (for payments) | Razorpay API key ID | [Razorpay Dashboard → Settings → API Keys](https://dashboard.razorpay.com/app/keys) |
| `RAZORPAY_KEY_SECRET` | **Yes** (for payments) | Razorpay API key secret | Same as above |
| `GEMINI_API_KEY` | **Yes** (for AI descriptions) | Google Gemini API key | [Google AI Studio](https://aistudio.google.com/apikey) |

**Example `backend/.env`:**
```env
PORT=8000
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/skill-exchange
JWT_SECRET=replace-with-a-long-random-string
SESSION_SECRET=replace-with-another-long-random-string
CLIENT_URL=http://localhost:5173

GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:8000/api/auth/google/callback

RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret

GEMINI_API_KEY=your-gemini-api-key
```

### 3.2 Create `frontend/.env`

| Variable | Required | Description |
|---|---|---|
| `VITE_API_URL` | No (defaults to `http://localhost:8000/api`) | Base URL of the backend API |
| `VITE_RAZORPAY_KEY_ID` | **Yes** (for payments) | Same Razorpay **Key ID** as above (public key, safe for frontend) |

**Example `frontend/.env`:**
```env
VITE_API_URL=http://localhost:8000/api
VITE_RAZORPAY_KEY_ID=your-razorpay-key-id
```

### 3.3 One-time setup script (optional — subscription plan)

`backend/scripts/create-plan.js` creates a Razorpay monthly subscription plan ("Swap Premium — Verified Helper", ₹199/month). Run it once if your app uses the subscription/premium-helper feature:

```bash
cd backend
node scripts/create-plan.js
```

It will print a `RAZORPAY_PLAN_ID` — add that to `backend/.env` if your subscription flow requires it.

### 3.4 Making yourself an admin

New users are created with `isAdmin: false`. To access the Admin Dashboard, manually flip a user's `isAdmin` field to `true` directly in MongoDB (e.g. via MongoDB Compass or the Atlas UI) after registering:

```js
// in mongosh, or Compass
db.users.updateOne({ email: "you@example.com" }, { $set: { isAdmin: true } })
```

---

## 4. Running Locally (without Docker)

### Backend
```bash
cd backend
npm install
npm start          # or: npm run server (uses nodemon if configured)
```
Runs on `http://localhost:8000` by default.

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Runs on `http://localhost:5173` by default (Vite's default port).

> Make sure `CLIENT_URL` in `backend/.env` matches the frontend URL, and `VITE_API_URL` in `frontend/.env` matches the backend URL, or CORS/OAuth/sockets will fail.

---

## 5. Running with Docker

```bash
docker compose up --build
```

- Backend → `http://localhost:8000`
- Frontend → `http://localhost:3000`

Requirements:
- `backend/.env` must exist (referenced via `env_file` in `docker-compose.yml`) — Docker will not start the backend without it.
- Update `CLIENT_URL` to `http://localhost:3000` (the Docker frontend port) if running this way.

---

## 6. Google OAuth Setup Checklist

1. Go to [Google Cloud Console → Credentials](https://console.cloud.google.com/apis/credentials).
2. Create an **OAuth 2.0 Client ID** (Web application type).
3. Add an **Authorized redirect URI** matching your `GOOGLE_CALLBACK_URL` exactly (e.g. `http://localhost:8000/api/auth/google/callback`).
4. Copy the generated Client ID and Client Secret into `backend/.env`.

## 7. Razorpay Setup Checklist

1. Sign up / log in to [Razorpay Dashboard](https://dashboard.razorpay.com/).
2. Switch to **Test Mode** for development.
3. Go to **Settings → API Keys** and generate a key pair.
4. Put the Key ID + Secret into `backend/.env` (`RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`).
5. Put the same Key ID into `frontend/.env` (`VITE_RAZORPAY_KEY_ID`).
6. (Optional) Run `backend/scripts/create-plan.js` if using subscriptions.

## 8. Gemini (AI Description) Setup Checklist

1. Go to [Google AI Studio](https://aistudio.google.com/apikey) and generate an API key.
2. Put it into `backend/.env` as `GEMINI_API_KEY`.
3. This powers the "generate description" feature when creating a skill listing (`backend/controller/ai.controller.js`).

---

## 9. Features Overview

- **Auth**: Email/password + Google OAuth, JWT-based sessions
- **Skills**: Create/browse/filter skill listings (free or paid, per-session or per-hour)
- **Bookings**: Request/accept/track sessions between seekers and helpers
- **Payments**: Razorpay checkout + server-side signature verification for paid bookings
- **Real-time**: Socket.IO powers live chat and booking notifications
- **Reviews**: Star ratings on completed sessions
- **Admin dashboard**: Approve/reject skill listings
- **AI assist**: Auto-generate a skill listing description with Gemini

---

## 10. Notes / Things to Double-Check Before Deploying

- [ ] Rotate `JWT_SECRET` / `SESSION_SECRET` to strong random values (don't reuse the examples above)
- [ ] Switch Razorpay from Test Mode to Live Mode keys before accepting real payments
- [ ] Update `GOOGLE_CALLBACK_URL` and the Google Cloud authorized redirect URI to your production domain
- [ ] Update `CLIENT_URL` and `VITE_API_URL` to production URLs
- [ ] Use a production MongoDB cluster (not a local instance)
- [ ] Never commit `.env` files to version control — add `.env` to `.gitignore` if not already there