const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const csurf = require("csurf");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet"); // Protects against the XSS attacks
const xssClean = require("xss-clean"); //Sanitizes the user input
const authRoutes = require("./routes/auth.routes");
const referralController = require('./controllers/referral.controller');
const sequelize = require("./utils/database");
const { authenticate } = require('./middleware/auth');

dotenv.config();

const app = express();


app.use(helmet()); // Adds security headers
app.use(xssClean()); // Sanitizes user input

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser()); // Needed for CSRF protection

// CSRF protection middleware
const csrfProtection = csurf({ cookie: true });
app.use(csrfProtection);


app.get("/api/csrf-token", (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});


const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Too many requests, please try again later.",
});

app.use("/api/login", authLimiter);
app.use("/api/register", authLimiter);
app.use("/api/referral", authenticate);
app.use("/api/referral-stats", authenticate);


app.use("/api", authRoutes);
app.get("/api/referral", referralController.getReferrals);
app.get("/api/referral-stats",referralController.getReferralStats);


app.use((err, req, res, next) => {
  if (err.code === "EBADCSRFTOKEN") {
    return res.status(403).json({ message: "Invalid CSRF token" });
  }
  next(err);
});

const PORT = process.env.PORT || 3000;

sequelize
  .sync({ alter: true })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database sync error:", err);
  });
