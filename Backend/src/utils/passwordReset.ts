import crypto from 'crypto';
import argon2 from 'argon2';
import nodemailer from 'nodemailer';

// Generate cryptographically secure reset token
export const generateResetToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

// Hash the reset token for secure storage
export const hashResetToken = async (token: string): Promise<string> => {
  return await argon2.hash(token);
};

// Verify reset token against hashed version
export const verifyResetToken = async (token: string, hashedToken: string): Promise<boolean> => {
  return await argon2.verify(hashedToken, token);
};

// Validate password strength
export const validatePasswordStrength = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Create email transporter (reusing existing Zoho configuration)
export const createEmailTransporter = () => {
  return nodemailer.createTransport({
    host: 'smtp.zoho.in',
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.ZOHO_NO_REPLY,
    },
  });
};

// Generate password reset email HTML
export const generateResetEmailHTML = (resetUrl: string, userFirstName: string): string => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Nivasa Password</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f43f5e, #fb923c); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: linear-gradient(135deg, #f43f5e, #fb923c); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
            .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px; }
            .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>🏠 Nivasa</h1>
            <h2>Password Reset Request</h2>
        </div>
        <div class="content">
            <p>Hello ${userFirstName},</p>
            <p>We received a request to reset your password for your Nivasa account. If you made this request, click the button below to reset your password:</p>
            
            <div style="text-align: center;">
                <a href="${resetUrl}" class="button">Reset My Password</a>
            </div>
            
            <div class="warning">
                <strong>⚠️ Security Notice:</strong>
                <ul>
                    <li>This link will expire in <strong>15 minutes</strong> for your security</li>
                    <li>If you didn't request this reset, please ignore this email</li>
                    <li>Never share this link with anyone</li>
                </ul>
            </div>
            
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="word-break: break-all; background: #e5e7eb; padding: 10px; border-radius: 4px; font-family: monospace;">${resetUrl}</p>
            
            <p>If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
            
            <p>Best regards,<br>The Nivasa Team</p>
        </div>
        <div class="footer">
            <p>This is an automated message. Please do not reply to this email.</p>
            <p>© ${new Date().getFullYear()} Nivasa. All rights reserved.</p>
        </div>
    </body>
    </html>
  `;
};

// Generate password reset confirmation email HTML
export const generateResetConfirmationEmailHTML = (userFirstName: string): string => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset Successful</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .success { background: #d1fae5; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0; border-radius: 4px; }
            .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>🏠 Nivasa</h1>
            <h2>✅ Password Reset Successful</h2>
        </div>
        <div class="content">
            <p>Hello ${userFirstName},</p>
            
            <div class="success">
                <strong>✅ Success!</strong> Your password has been successfully reset.
            </div>
            
            <p>Your Nivasa account password has been updated successfully. You can now log in with your new password.</p>
            
            <p><strong>Security Tips:</strong></p>
            <ul>
                <li>Keep your password secure and don't share it with anyone</li>
                <li>Use a unique password that you don't use for other accounts</li>
                <li>Consider using a password manager for better security</li>
            </ul>
            
            <p>If you didn't make this change, please contact our support team immediately.</p>
            
            <p>Best regards,<br>The Nivasa Team</p>
        </div>
        <div class="footer">
            <p>This is an automated message. Please do not reply to this email.</p>
            <p>© ${new Date().getFullYear()} Nivasa. All rights reserved.</p>
        </div>
    </body>
    </html>
  `;
};

// Send password reset email
export const sendPasswordResetEmail = async (
  email: string,
  resetToken: string,
  userFirstName: string
): Promise<void> => {
  const transporter = createEmailTransporter();
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;
  
  const mailOptions = {
    from: `"Nivasa" <${process.env.SMTP_USER}>`,
    to: email,
    subject: '🔐 Reset Your Nivasa Password',
    html: generateResetEmailHTML(resetUrl, userFirstName),
  };
  
  await transporter.sendMail(mailOptions);
};

// Send password reset confirmation email
export const sendPasswordResetConfirmationEmail = async (
  email: string,
  userFirstName: string
): Promise<void> => {
  const transporter = createEmailTransporter();
  
  const mailOptions = {
    from: `"Nivasa" <${process.env.SMTP_USER}>`,
    to: email,
    subject: '✅ Password Reset Successful - Nivasa',
    html: generateResetConfirmationEmailHTML(userFirstName),
  };
  
  await transporter.sendMail(mailOptions);
};