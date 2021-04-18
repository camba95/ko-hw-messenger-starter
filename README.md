# Messenger

A one-to-one realtime chat app.

## Requirements

- Postgres 11
- Redis 6

If you are familiar with docker you can use this file `server/docker/docker-compose.yml` to run requirements.

## Running Application Locally

Create a .env file in the server directory using the template `.env.example`.

```
psql
CREATE  DATABASE messenger;
\q

cd server
npm install

// seed the database
npm run seed

npm run dev
```
