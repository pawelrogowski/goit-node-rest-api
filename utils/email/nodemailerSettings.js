const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "outlook",
  secure: false,
  auth: {
    user: process.env.OUTLOOK_USER,
    pass: process.env.OUTLOOK_PASSWORD,
  },
});

module.exports = transporter;
