# Chat App

This is a simple chat app where you can chat with all the people in it.

## Create .env file in chat\server directory with this content
```bash
PORT=5000
PG_HOST=localhost
PG_USER=postgres
PG_PASSWORD=your-password
PG_PORT=5432
PG_DATABASE=postgres
JWT_SECRET=your-secret-key
```

Replace PG_PASSWORD and JWT_SECRET with your password and key

## How to run it
```bash
cd project-directory
```

### Frontend
```bash
cd client
npm install
npm run dev
```

### Backend
```bash
cd server
npm install
node server.js
```

### Go to
```bash
`localhost:5173`