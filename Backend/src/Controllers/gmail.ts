import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";

const htmlPath = path.join(__dirname, "../../gmailMessage.html");
const htmlContent = fs.readFileSync(htmlPath, "utf8");

const transporter = nodemailer.createTransport({
  host: "smtp.zoho.in",
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.ZOHO_NO_REPLY,
  },
});

export default async function sendMail(email: string, verificationURL: string) {
  // Set up mail options
  const mailOptions = {
    from: `Nivasa <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Account Verification of Nivasa",
    html: htmlContent
      .replace(/{{VERIFICATION_URL}}/g, verificationURL)
      .replace(/{{USER_EMAIL}}/g, email),
  };

  // Send email
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", info.response);
    return info.response;
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw error;
  }
}
