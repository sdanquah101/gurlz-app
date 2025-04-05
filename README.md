# Girls Wellness Platform

A comprehensive wellness platform built with React, Node.js, and MongoDB.

## Prerequisites

- Node.js (v18 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:

```env
MONGODB_URI=mongodb://localhost:27017/girls_wellness
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
PORT=3001
CLIENT_URL=http://localhost:5173
```

## Development

Start the frontend development server:

```bash
npm run dev
```

Start the backend server:

```bash
npm run server
```

For concurrent development of both frontend and backend:

```bash
npm run dev:all
```

## Building for Production

```bash
npm run build
```

## Project Structure

```
├── src/
│   ├── components/     # React components
│   ├── pages/         # Page components
│   ├── store/         # State management
│   ├── types/         # TypeScript types
│   ├── utils/         # Utility functions
│   └── server/        # Backend server code
├── public/            # Static assets
└── package.json       # Project configuration
```

## Features

- User Authentication
- Chat Communities
- Mental Health Resources
- Physical Wellness Tracking
- Fashion Trends
- Reproductive Health Tracking

## Tech Stack

- Frontend:
  - React
  - TypeScript
  - Tailwind CSS
  - Framer Motion
  - Socket.IO Client
  - Zustand

- Backend:
  - Node.js
  - Express
  - MongoDB
  - Socket.IO
  - JWT Authentication

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request