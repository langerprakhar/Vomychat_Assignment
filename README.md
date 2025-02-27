# LinkTree Backend API

## Project Overview
This project is a backend API for a LinkTree-like platform with a referral system. It handles **user authentication, referral tracking, and security protections**. The backend is **scalable** and has been **stress-tested using JMeter** to handle high concurrent traffic.

---

## Installation & Setup
### **Prerequisites**
- **Node.js** (v16 or later)
- **PostgreSQL** (or any SQL-compatible database)

### **1️ Install Dependencies**
Run the following command to install all required npm packages:
```sh
npm install
```

### **2️ Configure Environment Variables**
Create a `.env` file in the project root and add:
```env
DB_HOST=your_database_host
DB_USER=your_database_user
DB_PASS=your_database_password
DB_NAME=your_database_name
JWT_SECRET=your_jwt_secret
BASE_URL=http://localhost:3000
```

### **3️ Start the Server**
```sh
npm start
```
Server will be running on **`http://localhost:3000`**.

---

## Dependencies Used
| Package | Purpose |
|---------|---------|
| **express** | Web framework |
| **bcrypt** | Password hashing |
| **jsonwebtoken** | JWT authentication |
| **sequelize** | ORM for PostgreSQL |
| **pg** | PostgreSQL driver |
| **validator** | Input validation |
| **xss-clean** | Prevents XSS attacks |
| **csurf** | CSRF protection |
| **express-rate-limit** | Prevents brute-force attacks |
| **postman** | API testing |

---

## Directory Structure
```
linktr-backend/
│── controllers/      # API logic (auth, referral)
│── models/           # Sequelize models (User, Referral)
│── routes/           # API routes
│── utils/            # Utility functions (email, referral)
│── middleware/       # Security middleware (CSRF, rate limiting)
│── config/           # Database connection
│── .env              # Environment variables
│── server.js         # Main server file
│── README.md         # Project documentation
```

---

## 🔹 Using Postman for API Testing
### **1️ Getting Started**
- Install **Postman** from [postman.com](https://www.postman.com/downloads/)
- Open **Postman** and create a **new request**

### **2️ Testing Authentication APIs**
#### **Register User**
- **Method:** `POST`
- **URL:** `http://localhost:3000/api/register`
- **Body (JSON):**
```json
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "securepassword",
  "referral_code": "optional_code"
}
```
- **Click Send** → Expected Response:
```json
{ "message": "User registered successfully" }
```

#### **Login User**
- **Method:** `POST`
- **URL:** `http://localhost:3000/api/login`
- **Body (JSON):**
```json
{
  "email": "test@example.com",
  "password": "securepassword"
}
```
- **Click Send** → Expected Response:
```json
{ "token": "your_jwt_token" }
```

### **3️ Testing Referral System APIs**
#### **Get Referral Stats**
- **Method:** `GET`
- **URL:** `http://localhost:3000/api/referral-stats`
- **Headers:**
```json
{
  "Authorization": "Bearer your_jwt_token"
}
```
- **Click Send** → Expected Response:
```json
{
  "totalReferrals": 5,
  "successfulReferrals": 2
}
```

#### **Get User Referrals**
- **Method:** `GET`
- **URL:** `http://localhost:3000/api/referrals`
- **Headers:**
```json
{
  "Authorization": "Bearer your_jwt_token"
}
```
- **Click Send** → Expected Response:
```json
[
  { "username": "user1", "email": "user1@example.com" },
  { "username": "user2", "email": "user2@example.com" }
]
```

---

## Security Features
### **1️ CSRF Protection**
- CSRF tokens are **generated dynamically** and must be included in protected requests.
- Fetch the CSRF token using:
```sh
GET /api/csrf-token
```
- Include the token in your request headers:
```json
{ "X-CSRF-Token": "your_csrf_token" }
```

### **2️ SQL Injection Prevention**
- **Sequelize ORM** prevents SQL Injection by using **parameterized queries**.
- Example of secure query execution:
```js
const user = await User.findOne({ where: { email: req.body.email } });
```
- **Never concatenate raw SQL strings with user input!**

### **3️ XSS Protection**
- User input is sanitized using `xss-clean` and `validator`.
- Example:
```js
const username = xss(validator.escape(req.body.username));
```

### **4️ Rate Limiting** (Brute Force Protection)
- The login and registration endpoints **limit requests per user** to prevent brute-force attacks.
- Example in `server.js`:
```js
const rateLimit = require('express-rate-limit');
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 5 });
app.use("/api/login", authLimiter);
```

---

## Scalability & Performance
- **Stress-tested with JMeter** to handle high concurrent users.
- **Database optimized** with connection pooling in `sequelize`.

---

## Future Improvements
- Implement **Docker version** for easier deployment.
- Add **email verification** during registration.
- Improve **dashboard for referral tracking**.

---

## Author
Developed by **Prakhar Langer**

