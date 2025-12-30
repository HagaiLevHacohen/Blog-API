# Blog-API

A RESTful blog backend with two separate frontends (public reader and admin editor). Built to demonstrate a decoupled API-first architecture with protected authoring routes and JWT authentication.

Live demo (may take a moment to wake up on first load):
- Backend API: https://blog-api-xnl4.onrender.com
- Public frontend: https://hagablog.netlify.app/
- Admin/editor frontend: https://hagaiblogadmin.netlify.app/

Note: The backend is hosted on Render. On first access the service can be in a cold state — the initial request may take a minute or two while the instance starts.

## Features

- Posts with draft/published states
- Comments on posts
- User accounts and author roles
- JWT authentication for protected routes (Bearer token in Authorization header)
- RESTful API consumed by separate public and admin frontends

## Tech stack

- Backend: Node.js, Express, Prisma (PostgreSQL)
- Database: Neon (PostgreSQL hosted on Neon)
- Auth: JSON Web Tokens (jsonwebtoken)
- Frontends: Two separate sites deployed to Netlify (public reader and admin/editor)
- Deployment: Render (backend), Netlify (frontends)

## Prerequisites

- Node.js and npm (or yarn)
- A PostgreSQL-compatible database (Neon used in this project)
- Environment variables configured (see below)

## Environment variables

Create a .env file in the backend folder with at least the following:

- DATABASE_URL="postgresql://<user>:<pass>@<host>/<db>?schema=public"     # Neon connection URL
- SECRET="<secure_random_string>"
- NODE_ENV="development"

Create a .env file in the frontend and admin folder with at least the following:

- VITE_API_URL="http://localhost:3000"


## Installation

1. Clone the repo:
   git clone <repo_url>
2. Install dependencies:
   npm install
3. Set up the database and run Prisma migrations:
   npx prisma migrate deploy
   (For local development you can use npx prisma migrate dev)
4. Create a .env file using the keys above and set DATABASE_URL to your Neon connection string.

## Running

- Development:
  npm run dev
- Production:
  npm start

The API will listen on the PORT environment variable (default 3000).

## API Usage

- Authentication: POST /auth/login (returns a JWT)
- Protect routes by sending Authorization: Bearer <token>
- Typical resources:
  - /posts (GET list, POST create)
  - /posts/:id (GET single, PUT update, DELETE delete)
  - /posts/:id/comments (GET, POST)
  - /users (register, manage authors)

Refer to inline route/controller code for exact endpoints and request/response shapes.

## Frontends

- Public frontend (reader): fetches published posts from the API and allows commenting.
- Admin frontend (editor): protected UI for creating, editing, publishing/unpublishing posts and moderating comments. It authenticates via the API and stores the JWT (e.g., localStorage) and sends Authorization headers.

## Deployment notes

- Backend is hosted on Render: be aware of cold starts — initial requests can take longer while the service spins up.
- Database hosted on Neon (serverless Postgres). Ensure DATABASE_URL is set to your Neon connection string in deployed environment.
- Frontends are hosted on Netlify and should point to the backend API URL in their environment configurations.

## Security considerations

- JWTs are sent with Authorization: Bearer <token>. For more advanced setups consider refresh tokens or httpOnly cookies.
- Validate and sanitize user input (comments, posts) to prevent XSS.
- Protect admin routes on the backend (verify JWT and author role).

## Contributing

PRs welcome. Keep changes focused, add tests for new behavior, and update this README when public APIs change.

## License

Open source — use for educational purposes. Add a LICENSE file if a specific license is required.

## Acknowledgments

- Project structure and ideas inspired by backend-first teaching exercises
- Prisma for ORM and Neon for serverless Postgres
- Render and Netlify for hosting