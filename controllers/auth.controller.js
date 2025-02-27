const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User, Referral } = require("../models");
const { generateReferralCode } = require("../utils/referral");
const { v4: uuidv4 } = require("uuid");
const validator = require("validator");
const xss = require("xss"); // ✅ Import xss for XSS protection
const { sendPasswordResetEmail } = require("../utils/email");

exports.register = async (req, res) => {
  try {
    let { username, email, password, referral_code } = req.body;

    // ✅ Sanitize inputs to prevent XSS attacks
    username = xss(validator.escape(username));
    email = xss(validator.escape(email));
    referral_code = referral_code ? xss(validator.escape(referral_code)) : null;

    // Input Validation
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters long" });
    }

    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const existingUsername = await User.findOne({ where: { username } });
    if (existingUsername) {
      return res.status(409).json({ message: "Username already in use" });
    }

    // Hash password securely
    const password_hash = await bcrypt.hash(password, 10);

    // Generate unique referral code
    let referral_code_new = generateReferralCode();
    while (await User.findOne({ where: { referral_code: referral_code_new } })) {
      referral_code_new = generateReferralCode();
    }

    let referred_by_user = null;
    if (referral_code) {
      referred_by_user = await User.findOne({ where: { referral_code } });
      if (!referred_by_user) {
        return res.status(400).json({ message: "Invalid referral code" });
      }
    }

    // Create new user
    const user = await User.create({
      username,
      email,
      password_hash,
      referral_code: referral_code_new,
      referred_by: referred_by_user ? referred_by_user.id : null,
    });

    if (referred_by_user) {
      // Create Referral entry
      await Referral.create({
        referrer_id: referred_by_user.id,
        referred_user_id: user.id,
        date_referred: new Date(),
        status: "successful",
      });
    }

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    let { email, password } = req.body;

    // ✅ Sanitize inputs
    email = xss(validator.escape(email));

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in .env");
    }

    const user = await User.findOne({ where: { email } });

    // Generic error message to prevent enumeration attacks
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Store JWT in a secure HttpOnly cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 3600000, // 1 hour
    });

    // ✅ ALSO RETURN TOKEN IN RESPONSE
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


exports.forgotPassword = async (req, res) => {
  try {
    let { email } = req.body;

    // ✅ Sanitize inputs
    email = xss(validator.escape(email));

    const user = await User.findOne({ where: { email } });

    // Generic response to prevent email enumeration
    if (!user) {
      return res.status(200).json({ message: "If an account exists, a password reset email has been sent." });
    }

    const resetToken = uuidv4();
    const resetTokenExpiresAt = new Date(Date.now() + 3600000); // Token expires in 1 hour

    // Store the token and expiration in the database
    user.reset_token = resetToken;
    user.reset_token_expires_at = resetTokenExpiresAt;
    await user.save();

    const resetLink = `${process.env.BASE_URL}/reset-password?token=${resetToken}`;

    // Send the password reset email
    await sendPasswordResetEmail(user.email, resetLink);

    res.status(200).json({ message: "If an account exists, a password reset email has been sent." });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
