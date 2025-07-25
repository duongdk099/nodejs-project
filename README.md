# Node.js & MongoDB Project

A RESTful API built with Node.js, Express and MongoDB.  
Provides user authentication, role-based authorization and management of “salles” (rooms).  

---

## Table of Contents

- [Features](#features)  
- [Prerequisites](#prerequisites)  
- [Installation](#installation)  
- [Configuration](#configuration)  
- [Running the Server](#running-the-server)  
- [API Documentation](#api-documentation)  
  - [Authentication](#authentication)  
  - [Salles (Rooms)](#salles--rooms-)  
- [Data Models](#data-models)  
- [Authentication & Authorization](#authentication--authorization)  
- [Environment Variables](#environment-variables)  
- [License](#license)  

---

## Features

- User registration and login (JWT)  
- Role-based access control (`super_admin`, `proprietaire_salle`, `client`)  
- CRUD operations on “salles” (rooms)  
- “Approuver” endpoint to approve a salle  
- Mongoose schemas for Users, Salles, Défis, Sessions, Badges, and TypesExercice  

---

## Prerequisites

- Node.js (v16+)  
- npm or yarn  
- MongoDB (local or Atlas)  

---

## Installation

1. Clone the repository  
   ```bash
   git clone <your-repo-url>
   cd projet
   ```  
2. Install dependencies  
   ```bash
   npm install
   ```  

---

## Configuration

1. Copy `.env.example` to `.env` (or create a `.env` file in the project root).  
2. Populate with your values:  
   ```dotenv
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=3000
   ```  

---

## Running the Server

```bash
npm start
```

By default, the server listens on `http://localhost:3000/`.  
Hit `GET /` to confirm:  
```text
API is running
```

---

## API Documentation

Base URL: `http://localhost:3000/api`

### Authentication

| Method | Endpoint            | Description                      | Body                                                                                  |
| ------ | ------------------- | -------------------------------- | ------------------------------------------------------------------------------------- |
| POST   | `/auth/register`    | Create a new user                | `{ "nom": "Alice", "email": "alice@example.com", "password": "secret", "role": "client" }` |
| POST   | `/auth/login`       | Authenticate and receive a token | `{ "email": "alice@example.com", "password": "secret" }`                              |
| GET    | `/auth/protected`   | Super-admin only test route      | Header: `Authorization: Bearer <token>`                                               |
### Salles (Rooms)

Protected: only `super_admin` can access. Include header `Authorization: Bearer <token>`

| Method | Endpoint                     | Description                         | Body / Params                                              |
| ------ | ---------------------------- | ----------------------------------- | ---------------------------------------------------------- |
| POST   | `/salles`                    | Create a new salle                  | `{ "nom": "Gym A", "capacite": 20, "proprietaire_id": "<userId>", ... }` |
| GET    | `/salles`                    | List all salles                     | –                                                          |
| PUT    | `/salles/:id`                | Update a salle                      | Params: `id`<br>Body: fields to update                    |
| DELETE | `/salles/:id`                | Delete a salle                      | Params: `id`                                               |
| PUT    | `/salles/:id/approuver`      | Approve a salle                     | Params: `id`                                               |

### Salles Proprietaire (Room Owner)

Protected: only `proprietaire_salle` can access.

| Method | Endpoint                          | Description                          | Body                                                         |
| ------ | --------------------------------- | ------------------------------------ | ------------------------------------------------------------ |
| POST   | `/proprietaire/salles/demande`    | Submit a new salle for approval      | `{ "nom": ..., "capacite": ..., ... }`                   |
| GET    | `/proprietaire/salles/mienne`     | List own salles                      | –                                                            |
| PUT    | `/proprietaire/salles/mienne`     | Update own salle                     | Body: fields to update                                       |

### TypesExercices (Exercise Types)

Protected: only `super_admin` can access.

| Method | Endpoint                     | Description                         | Body                                                         |
| ------ | ---------------------------- | ----------------------------------- | ------------------------------------------------------------ |
| POST   | `/types-exercices`           | Create a new exercise type          | `{ "nom": "Push-up", "description": ..., "muscles": ["chest"] }` |
| GET    | `/types-exercices`           | List all exercise types             | –                                                            |
| PUT    | `/types-exercices/:id`       | Update an exercise type             | Params: `id`<br>Body: fields to update                       |
| DELETE | `/types-exercices/:id`       | Delete an exercise type             | Params: `id`                                                 |

### Badges

Protected: only `super_admin` can access.

| Method | Endpoint             | Description                  | Body                                                         |
| ------ | -------------------- | ---------------------------- | ------------------------------------------------------------ |
| POST   | `/badges`            | Create a new badge           | `{ "nom": "Marathoner", "description": ..., "regles": { "sessions": 10 } }` |
| GET    | `/badges`            | List all badges              | –                                                            |
| PUT    | `/badges/:id`        | Update a badge               | Params: `id`<br>Body: fields to update                       |
| DELETE | `/badges/:id`        | Delete a badge               | Params: `id`                                                 |

### Users (Admin)

Protected: only `super_admin` can access.

| Method | Endpoint               | Description                    | Body / Params                                               |
| ------ | ---------------------- | ------------------------------ | ----------------------------------------------------------- |
| GET    | `/users`               | List all users                 | –                                                           |
| PUT    | `/users/:id/desactiver`| Deactivate a user              | Params: `id`                                                |
| DELETE | `/users/:id`           | Delete a user                  | Params: `id`                                                |

### Défis (Challenges)

| Role            | Method | Endpoint                         | Description                        | Body / Params                                          |
| --------------- | ------ | -------------------------------- | ---------------------------------- | ------------------------------------------------------ |
| client          | POST   | `/defis`                         | Create a new challenge             | `{ "titre": ..., "objectifs": [...], ... }`        |
| client          | GET    | `/defis`                         | Explore challenges (filters, page) | Query: `difficulte`, `type`, `minDuree`, `maxDuree`, `page`, `limit` |
| client          | POST   | `/defis/:id/partager`            | Generate share link                | Params: `id`                                           |
| client          | POST   | `/defis/:id/inviter`             | Invite friends                     | `{ "friendIds": ["id1","id2"] }`                 |
| client          | POST   | `/defis/:id/defier`              | Challenge another user             | `{ "userId": "<userId>" }`                        |
| super_admin     | PUT    | `/defis/:id/approuver`           | Approve a proposed challenge       | Params: `id`                                           |
| super_admin     | PUT    | `/defis/:id`                     | Update any challenge               | Params: `id`<br>Body: fields to update                  |
| super_admin     | DELETE | `/defis/:id`                     | Delete a challenge                 | Params: `id`                                           |
| proprietaire    | POST   | `/defis/proposer`                | Propose challenge for own salle    | `{ "salle_id": ..., "titre": ..., ... }`           |

### Sessions (Activity)

Protected: only `client` can access.

| Method | Endpoint               | Description            | Body                                                         |
| ------ | ---------------------- | ---------------------- | ------------------------------------------------------------ |
| POST   | `/sessions`            | Record a session       | `{ "defi_id": ..., "date": ..., "calories": 500, "stats": {...} }` |
| GET    | `/sessions`            | List own sessions      | –                                                            |

---
## Data Models
Listing of all Mongoose schemas & fields:
See [`/models`] directory for details.  

## Middleware & Utilities
- `authenticate`: JWT validation, sets `req.user`.  
- `authorizeRoles(...)`: Role-based guard.  
- `asyncHandler`: wraps controllers to centralize error handling.  

## Error Handling
- Centralized in `index.js` (global error handler).  
- HTTP status codes & messages standardized via controllers.  

## Environment Variables
| Key         | Description                               |
| ----------- | ----------------------------------------- |
| `MONGO_URI` | MongoDB connection string                 |
| `JWT_SECRET`| Secret for signing JWT tokens             |
| `PORT`      | Port for Express server (default 3000)    |

## License
Licensed under the MIT License.  

---

## Data Models

### User

- `nom` (String, required)  
- `email` (String, required, unique)  
- `password` (String, hashed)  
- `role` (Enum: `super_admin` \| `proprietaire_salle` \| `client`)  
- `statut` (Boolean, default: `true`)  

### Salle

- `nom` (String, required)  
- `capacite` (Number, required)  
- `equipements` (String[])  
- `caracteristiques` (Mixed)  
- `type_exercices` (ObjectId[] → [`TypesExercice`](models/typesExercice.js))  
- `niveau_difficulte` (String)  
- `proprietaire_id` (ObjectId → [`User`](models/user.js), required)  
- `statut` (Enum: `approuve` \| `en_attente`, default: `en_attente`)  
- `adresse` (String)  
- `contact` (String)  

### Défi

- `titre` (String, required)  
- `objectifs` (String[])  
- `exercices` (ObjectId[] → [`TypesExercice`](models/typesExercice.js))  
- `duree` (Number)  
- `difficulte` (String)  
- `createur_id` (ObjectId → [`User`](models/user.js), required)  
- `salle_id` (ObjectId → [`Salle`](models/salle.js), required)  
- `statut` (Enum: `propose` \| `approuve`, default: `propose`)  
- `score_bonus` (Number, default: 0)  

### Session

- `user_id` (ObjectId → [`User`](models/user.js), required)  
- `defi_id` (ObjectId → [`Defi`](models/defi.js), required)  
- `date` (Date, default: now)  
- `calories` (Number)  
- `stats` (Mixed)  

### Badge

- `nom` (String, required)  
- `description` (String)  
- `regles` (Mixed)  

### TypesExercice

- `nom` (String, required)  
- `description` (String)  
- `muscles` (String[])  

---

## Authentication & Authorization

- All protected routes require a JWT in the `Authorization` header:  
  ```
  Authorization: Bearer <token>
  ```  
- `authenticate` middleware verifies token and populates `req.user`.  
- `authorizeRoles(...)` checks `req.user.role` against allowed roles.  

---

## Environment Variables

| Key         | Description                     |
| ----------- | ------------------------------- |
| `MONGO_URI` | MongoDB connection string       |
| `JWT_SECRET`| Secret for signing JWT tokens   |
| `PORT`      | Port for Express server         |

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
