# Student Registration – MERN CRUD

React (Vite) + Express + Mongoose + MongoDB. Database `studentdb`, collection `students`.

## Prerequisites
- Node.js 18+
- MongoDB running locally on the default port 27017 (the database and collection are created automatically on the first registration)

## Run
Terminal 1 – backend
```
cd server
npm install
npm start          # http://localhost:5000
```
Terminal 2 – frontend
```
cd client
npm install
npm run dev        # http://localhost:5173
```
Open http://localhost:5173.

To use MongoDB Atlas, set `MONGO_URI` before `npm start`.

## REST API
| Method | URL             | Purpose              |
|--------|-----------------|----------------------|
| GET    | /students       | Retrieve all students |
| POST   | /students       | Register a student   |
| PUT    | /students/:id   | Update a student     |
| DELETE | /students/:id   | Delete a student     |

## Demo checklist
1. Fill in the form and click **Register** → "Registration successful" appears and the new row shows in the table.
2. Click **Edit** → the form fills with the record (leave password blank to keep it) → **Update** → the table refreshes.
3. Click **Delete** → confirm → the row disappears.
4. Verify in the database: `mongosh` → `use studentdb` → `db.students.find().pretty()`

## Notes
- Passwords are stored as bcrypt hashes and are never returned by `GET /students`.
- Email must be unique; a duplicate shows "Email already registered".
