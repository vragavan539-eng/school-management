# EduManage — School Management System
### MERN Stack (MongoDB + Express + React + Node.js)

---

## 📁 Project Structure

```
school-management/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Student.js
│   │   ├── Teacher.js
│   │   ├── Attendance.js
│   │   ├── Result.js
│   │   ├── Fee.js
│   │   └── Notice.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── students.js
│   │   ├── teachers.js
│   │   ├── attendance.js
│   │   ├── results.js
│   │   ├── fees.js
│   │   └── notices.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
└── frontend/
    ├── public/
    │   └── index.html
    └── src/
        ├── pages/
        │   ├── Login.js
        │   ├── Dashboard.js
        │   ├── Students.js
        │   ├── Teachers.js
        │   ├── Attendance.js
        │   ├── Results.js
        │   ├── Timetable.js
        │   ├── Fees.js
        │   └── Notices.js
        ├── components/
        │   └── Layout.js
        ├── services/
        │   └── api.js
        ├── context/
        │   └── AuthContext.js
        ├── App.js
        ├── index.js
        ├── index.css
        └── package.json
```

---

## 🚀 Setup & Run

### Step 1 — Install MongoDB
Download MongoDB Community from https://www.mongodb.com/try/download/community
Or use MongoDB Atlas (free cloud): https://www.mongodb.com/atlas

### Step 2 — Backend setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env and set your MONGO_URI and JWT_SECRET
npm run dev
```
Backend runs at: http://localhost:5000

### Step 3 — Create first admin user
Use Postman or curl:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin","email":"admin@school.edu","password":"admin123","role":"admin"}'
```

### Step 4 — Frontend setup
```bash
cd frontend
npm install
npm start
```
Frontend runs at: http://localhost:3000

---

## 🔐 Default Login
- Email: admin@school.edu
- Password: admin123

---

## 🌐 API Endpoints

| Method | Endpoint                     | Description                   |
|--------|------------------------------|-------------------------------|
| POST   | /api/auth/login              | Login                         |
| POST   | /api/auth/register           | Register user                 |
| GET    | /api/auth/me                 | Get current user              |
| GET    | /api/students                | List students (search/filter) |
| POST   | /api/students                | Add student                   |
| PUT    | /api/students/:id            | Update student                |
| DELETE | /api/students/:id            | Deactivate student            |
| GET    | /api/teachers                | List teachers                 |
| POST   | /api/teachers                | Add teacher                   |
| GET    | /api/attendance              | Get attendance records        |
| POST   | /api/attendance/bulk         | Mark bulk attendance          |
| GET    | /api/attendance/summary/:id  | Monthly summary               |
| GET    | /api/results                 | Get results                   |
| POST   | /api/results                 | Add result                    |
| POST   | /api/results/compute-ranks   | Recalculate ranks             |
| GET    | /api/fees                    | Get fee records               |
| POST   | /api/fees/:id/payment        | Record payment                |
| GET    | /api/notices                 | Get notices                   |
| POST   | /api/notices                 | Post notice                   |
| DELETE | /api/notices/:id             | Remove notice                 |

---

## 🔑 Roles & Permissions

| Feature       | Admin | Teacher | Student |
|---------------|-------|---------|---------|
| Add/Edit Students | ✅ | ✅ | ❌ |
| Delete Students   | ✅ | ❌ | ❌ |
| Mark Attendance   | ✅ | ✅ | ❌ |
| Upload Results    | ✅ | ✅ | ❌ |
| Manage Fees       | ✅ | ❌ | ❌ |
| Post Notices      | ✅ | ✅ | ❌ |
| View Dashboard    | ✅ | ✅ | ✅ |

---

## 📦 Tech Stack
- **Frontend**: React 18, React Router v6, Chart.js, Axios
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Auth**: JWT (JSON Web Tokens) + bcryptjs
- **Styling**: Custom CSS (no UI library needed)
