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

Replace PG_PASSWORD and JWT_SECRET with your password and key.

## How to run it (locally)

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
localhost:5173
```

### How to run unit tests

Install

```bash
npm install --save-dev node-mocks-http
```

Run

```bash
npm test
```

## How to run it (on Docker)

```bash
cd project-directory
docker exec -it chat-postgres-1 psql -U postgres -d postgres
run the sql commands from the txt file
docker-compose up --build
```