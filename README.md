# TDC Matchmaker Dashboard

A modern, AI-powered matchmaking dashboard built with React, TypeScript, Node.js, Express, and MongoDB.

## Project Structure

```
matchmaker-dashboard/
├── client/                          # Frontend (Vite + React + TypeScript)
│   ├── public/                      # Static assets
│   │   └── vite.svg
│   ├── src/
│   │   ├── components/              # Reusable UI components
│   │   │   ├── common/              # Common components used across the app
│   │   │   │   └── PageHeader.tsx
│   │   │   ├── customers/           # Customer-related components
│   │   │   │   ├── CustomerList.tsx
│   │   │   │   └── CustomerStatusChip.tsx
│   │   │   └── dashboard/           # Dashboard-specific components
│   │   │       ├── ActivityFeed.tsx
│   │   │       ├── MatchSuccessRate.tsx
│   │   │       └── RecentMatches.tsx
│   │   ├── contexts/                # React contexts
│   │   │   └── AuthContext.tsx
│   │   ├── pages/                   # Page components
│   │   │   ├── Dashboard.tsx
│   │   │   ├── CustomerList.tsx
│   │   │   ├── CustomerDetail.tsx
│   │   │   └── ...
│   │   ├── services/                # API services
│   │   │   └── api.ts
│   │   ├── types/                   # TypeScript type definitions
│   │   │   └── index.ts
│   │   ├── utils/                   # Utility functions
│   │   ├── App.tsx                  # Main App component
│   │   ├── main.tsx                 # App entry point
│   │   └── vite-env.d.ts
│   ├── .env                         # Environment variables
│   ├── package.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   ├── vite.config.ts
│   └── index.html
├── server/                          # Backend (Node.js + Express + TypeScript)
│   ├── src/
│   │   ├── config/                 # Configuration files
│   │   ├── controllers/            # Route controllers
│   │   │   ├── authController.ts
│   │   │   ├── customerController.ts
│   │   │   └── matchController.ts
│   │   ├── middleware/             # Express middleware
│   │   ├── models/                 # Database models
│   │   │   ├── User.ts
│   │   │   ├── Customer.ts
│   │   │   └── Match.ts
│   │   ├── routes/                 # API routes
│   │   │   ├── auth.ts
│   │   │   ├── customers.ts
│   │   │   └── matches.ts
│   │   ├── services/               # Business logic
│   │   ├── utils/                  # Utility functions
│   │   └── server.ts               # Server entry point
│   ├── .env                        # Environment variables
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn
- MongoDB (local or Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/shreyanshtri26/matchmaker-dashboard.git
   cd matchmaker-dashboard
   ```

2. **Set up the backend**
   ```bash
   cd server
   npm install
   cp .env.example .env
   # Update .env with your configuration
   npm run dev
   ```

3. **Set up the frontend**
   ```bash
   cd ../client
   npm install
   cp .env.example .env
   # Update .env with your API URL
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## Development

### Available Scripts

**Client:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run type-check` - Check TypeScript types

**Server:**
- `npm run dev` - Start development server with hot-reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Features

- Modern React with TypeScript
- Responsive UI with Tailwind CSS
- JWT Authentication
- Role-based access control
- Real-time updates
- AI-powered matchmaking
- Data visualization
- Form validation
- Error handling
- Unit and integration tests

## Environment Variables

**Client (`.env`)**
```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

**Server (`.env`)**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/matchmaker
JWT_SECRET=your-jwt-secret
GOOGLE_API_KEY=your-google-api-key
```

## Testing

Run tests for both client and server:

```bash
# Client tests
cd client
npm test

# Server tests
cd ../server
npm test
```

## Deployment

1. Build the application:
   ```bash
   # Client
   cd client
   npm run build

   # Server
   cd ../server
   npm run build
   ```

2. Deploy the built files to your hosting service (e.g., Vercel, Heroku, AWS).
