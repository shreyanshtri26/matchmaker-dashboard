# Matchmaker Dashboard

A modern, full-stack application for TDC matchmakers to efficiently manage clients, view profiles, assign matches, and record notes. Built with React, TypeScript, Node.js, and MongoDB.

## Features

- **Client Management**: Add, view, and manage client profiles
- **Match Assignment**: Intelligent match suggestions based on compatibility
- **Notes & Tracking**: Record and track client interactions and preferences
- **Responsive UI**: Clean, modern interface built with Tailwind CSS
- **Secure Authentication**: JWT-based authentication system
- **AI-Powered**: Enhanced with Google Gemini for intelligent match suggestions

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for fast development
- Tailwind CSS for styling
- React Router for navigation
- Axios for API requests

### Backend
- Node.js with Express
- TypeScript for type safety
- MongoDB with Mongoose ODM
- JWT for authentication
- Google Gemini API for AI features
- Bcrypt for password hashing

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or Atlas)
- Google Gemini API key

### Backend Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the server directory with the following variables:
   ```env
   MONGO_URI=mongodb://localhost:27017/matchmaker
   GEMINI_API_KEY=your-gemini-api-key
   JWT_SECRET=your-secure-jwt-secret
   FRONTEND_URL=http://localhost:5173
   PORT=5000
   ```

4. Seed the database with sample data:
   ```bash
   npm run seed
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the client directory:
   ```bash
   cd ../client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the client directory:
   ```env
   VITE_API_BASE=http://localhost:5000/api
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser to `http://localhost:5173`

## Match Compatibility Levels

- **High Potential Match (80-100)**: Green gradient badge
- **Good Compatibility (65-79)**: Blue gradient badge
- **Average Match (50-64)**: Yellow gradient badge
- **Limited Compatibility (<50)**: Gray gradient badge
