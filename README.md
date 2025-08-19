# Matchmaker Dashboard MVP

This is an internal tool for TDC matchmakers to manage clients, view profiles, assign matches, and record notes. Built as an MVP with React frontend and Node.js backend.


## Setup (Local)
1. **Backend**:
   - `cd server`
   - `npm install`
   - Create `.env` with `MONGO_URI=mongodb://localhost:27017/matchmaker`, `GEMINI_API_KEY=your-key`, `JWT_SECRET=secret`, `FRONTEND_URL=http://localhost:5173`
   - Run `npm run seed` to populate DB
   - `npm run dev` to start server (port 5000)

2. **Frontend**:
   - `cd client`
   - `npm install`
   - Create `.env` with `VITE_API_BASE=http://localhost:5000/api`
   - `npm run dev` to start (port 5173)


##  Match Level Classification:

`High Potential Match (80-100): Green gradient badge`
`Good Compatibility (65-79): Blue gradient badge ` 
`Average Match (50-64): Yellow gradient badge`
`Limited Compatibility (<50): Gray gradient badge`


## Deployment
### Backend on Render
1. Create a new Web Service on Render, connect GitHub repo (server folder).
2. Set Runtime: Node.
3. Build Command: `npm install && npm run build`
4. Start Command: `npm start`
5. Add Env Vars: `MONGO_URI` (use MongoDB Atlas), `GEMINI_API_KEY`, `JWT_SECRET`, `FRONTEND_URL` (your Vercel URL).
6. Deploy. Note: Run seed locally or add a one-time endpoint.



### Frontend on Vercel
1. Create a new project on Vercel, import GitHub repo (client folder).
2. Vercel auto-detects Vite/React.
3. Add Env Var: `VITE_API_BASE=https://your-render-app.onrender.com/api`
4. Deploy.



## Tech Choices
The frontend uses Vite + React + TypeScript for fast development and type safety, with Tailwind CSS for styling (custom colors: Primary #dea75e for actions, Secondary #242e30 for text, Background #fff5e1 for base). Reusable UI components (Button, Input, Select) ensure DRY code. The backend employs Node.js + Express + TypeScript for robust API handling, MongoDB for flexible data storage, and Google Gemini for AI enhancements. Authentication uses bcrypt for hashing and JWT for tokens. Seed script populates realistic data.

## Matching Logic
Matching is gender-specific and scalable. For male customers, prioritize women who are younger (age < customer's), earn less (income < customer's), shorter (height < customer's), and match on wanting kids. For female customers, focus on compatibility in profession (similar designation/company), values (matching relocation, pets, languages), and other factors like marital status. Gemini AI dynamically evaluates via prompts for scores/explanations, filtering matches above 50 and sorting by score.

## How AI is Used
Google Gemini enhances the experience in two ways: (1) Scoring/ranking matches with explanations (e.g., "High Potential Match due to aligned relocation and professional synergy" based on gender-specific logic), using LLM-based natural language reasoning for profile fit; (2) Generating short, personalized intros for emails/introductions.

## Assumptions Made
Assumed all customers are assigned to the logged-in matchmaker (no multi-user support). Dummy profiles are mixed genders for the pool, filtered by opposite gender. Auth is basic (username/password with JWT); no password reset. Notes are mocked with alerts; real emails are mocked. Seeding runs separately; data is Indian-centric for realism. For deployment, MongoDB is cloud-hosted (e.g., Atlas).