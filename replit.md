# Chat Application

## Overview
A real-time chat application built with Node.js, Socket.io, and SQLite. Users can register, login, and chat with other users in real-time.

## Project Structure
- `server.js` - Main server file, handles HTTP requests and Socket.io connections
- `database.js` - SQLite database configuration and connection
- `public/` - HTML files (login, register, chat, 404 pages)
- `css/` - Stylesheets
- `js/` - Client-side JavaScript
- `img/` - Images and user avatars (stored in `img/avatars/`)

## Tech Stack
- **Runtime**: Node.js
- **WebSockets**: Socket.io
- **Database**: SQLite (file-based, stored as `utenti.db`)
- **Authentication**: bcrypt for password hashing

## Running the Application
The server runs on port 5000 and serves the frontend directly. No separate frontend build is required.

## Key Features
- User registration and login with phone number
- Password validation (requires uppercase, lowercase, digit, special character, 8+ chars)
- Real-time chat messaging
- Avatar upload and management
- Rate limiting for login attempts
