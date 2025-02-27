const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail', // change if using a different email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Send password reset email
 * @param {string} email - Recipient email address
 * @param {string} resetLink - Password reset link
 */
const sendPasswordResetEmail = async (email, resetLink) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Request',
      text: `Click the link to reset your password: ${resetLink}`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Password reset email sent: ${info.response}`);
  } catch (error) {
    console.error(`❌ Error sending email: ${error.message}`);
  }
};

module.exports = { sendPasswordResetEmail };
