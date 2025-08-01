import nodemailer from 'nodemailer';
import fs from "fs"
import path from "path"

const htmlPath = path.join(__dirname, 'gmailMessage.html');
const htmlContent = fs.readFileSync(htmlPath, 'utf8');


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'contact.nivasa@gmail.com',           // Your Gmail address
    pass: 'kcri vgww neob rjyl',        // App password from Google
  },
});

// Set up mail options
const mailOptions = {
  from: 'contact.nivasa@gmail.com',
  to: 'vermapratyush486@gmail.com',
  subject: 'Account Verification of Nivasa',
  html: htmlContent,
};

// Send email
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error('Error sending email:', error);
  } else {
    console.log('Email sent:', info.response);
  }
});
console.log("Email sent!!")