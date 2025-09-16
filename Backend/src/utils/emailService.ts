import nodemailer from "nodemailer";
import { IBooking } from "../Models/BookingModel";
import fs from "fs";
import path from "path";

// Create transporter
const transporter = nodemailer.createTransport({
  host: "smtp.zoho.in",
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.ZOHO_NO_REPLY,
  },
});

// Generate QR code for check-in (simplified - you can use a QR library)
const generateCheckInQR = (bookingId: string): string => {
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    `Nivasa Check-in: ${bookingId}`
  )}`;
};

// Load and process email templates
const getBookingConfirmationTemplate = (booking: any): string => {
  try {
    const templatePath = path.join(__dirname, '../templates/bookingConfirmationUser.html');
    let template = fs.readFileSync(templatePath, 'utf8');
    
    // Replace placeholders with actual data
    const checkInDate = new Date(booking.checkIn).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    
    const checkOutDate = new Date(booking.checkOut).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Replace template variables
    template = template
      .replace(/\{\{booking\.listing\.title\}\}/g, booking.listing.title)
      .replace(/\{\{checkInDate\}\}/g, checkInDate)
      .replace(/\{\{checkOutDate\}\}/g, checkOutDate)
      .replace(/\{\{booking\.listing\.location\.address\.city\}\}/g, booking.listing.location.address.city)
      .replace(/\{\{booking\.listing\.location\.address\.state\}\}/g, booking.listing.location.address.state || '')
      .replace(/\{\{booking\.totalGuests\}\}/g, booking.totalGuests.toString())
      .replace(/\{\{booking\.nights\}\}/g, booking.nights.toString())
      .replace(/\{\{booking\.priceBreakdown\.basePrice\}\}/g, booking.priceBreakdown.basePrice.toString())
      .replace(/\{\{booking\.priceBreakdown\.cleaningFee\}\}/g, booking.priceBreakdown.cleaningFee.toString())
      .replace(/\{\{booking\.priceBreakdown\.serviceFee\}\}/g, booking.priceBreakdown.serviceFee.toString())
      .replace(/\{\{booking\.priceBreakdown\.taxes\}\}/g, booking.priceBreakdown.taxes.toString())
      .replace(/\{\{booking\.totalPrice\}\}/g, booking.totalPrice.toString())
      .replace(/\{\{booking\.bookingId\}\}/g, booking.bookingId)
      .replace(/\{\{booking\.user\.firstName\}\}/g, booking.user.firstName)
      .replace(/\{\{qrCodeUrl\}\}/g, generateCheckInQR(booking.bookingId));

    // Handle property image
    if (booking.listing.images && booking.listing.images[0]) {
      template = template.replace(/\{\{propertyImageHtml\}\}/g, 
        `<img src="${booking.listing.images[0]}" alt="${booking.listing.title}" class="property-image">`);
    } else {
      template = template.replace(/\{\{propertyImageHtml\}\}/g, '');
    }

    return template;
  } catch (error) {
    console.error('Error loading booking confirmation template:', error);
    // Fallback to simple template
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #10B981;">🎉 Booking Confirmed!</h2>
        <p>Your booking for <strong>${booking.listing.title}</strong> has been confirmed.</p>
        <p><strong>Booking ID:</strong> ${booking.bookingId}</p>
        <p><strong>Check-in:</strong> ${new Date(booking.checkIn).toLocaleDateString()}</p>
        <p><strong>Check-out:</strong> ${new Date(booking.checkOut).toLocaleDateString()}</p>
        <p><strong>Total:</strong> ₹${booking.totalPrice}</p>
      </div>
    `;
  }
};

const getHostNotificationTemplate = (booking: any): string => {
  try {
    const templatePath = path.join(__dirname, '../templates/bookingNotificationHost.html');
    let template = fs.readFileSync(templatePath, 'utf8');
    
    // Replace placeholders with actual data
    const checkInDate = new Date(booking.checkIn).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    
    const checkOutDate = new Date(booking.checkOut).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Calculate payout (assuming 3% platform fee)
    const platformFee = booking.totalPrice * 0.03;
    const hostPayout = booking.totalPrice - platformFee;

    // Replace template variables
    template = template
      .replace(/\{\{booking\.listing\.title\}\}/g, booking.listing.title)
      .replace(/\{\{checkInDate\}\}/g, checkInDate)
      .replace(/\{\{checkOutDate\}\}/g, checkOutDate)
      .replace(/\{\{booking\.user\.firstName\}\}/g, booking.user.firstName)
      .replace(/\{\{booking\.user\.lastName\}\}/g, booking.user.lastName)
      .replace(/\{\{booking\.user\.email\}\}/g, booking.user.email)
      .replace(/\{\{booking\.totalGuests\}\}/g, booking.totalGuests.toString())
      .replace(/\{\{booking\.nights\}\}/g, booking.nights.toString())
      .replace(/\{\{booking\.totalPrice\}\}/g, booking.totalPrice.toString())
      .replace(/\{\{hostPayout\}\}/g, hostPayout.toFixed(2))
      .replace(/\{\{platformFee\}\}/g, platformFee.toFixed(2))
      .replace(/\{\{booking\.bookingId\}\}/g, booking.bookingId)
      .replace(/\{\{booking\.host\.firstName\}\}/g, booking.host.firstName);

    // Handle property image
    if (booking.listing.images && booking.listing.images[0]) {
      template = template.replace(/\{\{propertyImageHtml\}\}/g, 
        `<img src="${booking.listing.images[0]}" alt="${booking.listing.title}" class="property-image">`);
    } else {
      template = template.replace(/\{\{propertyImageHtml\}\}/g, '');
    }

    return template;
  } catch (error) {
    console.error('Error loading host notification template:', error);
    // Fallback to simple template
    const checkInDate = new Date(booking.checkIn).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    
    const checkOutDate = new Date(booking.checkOut).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #10B981;">🎉 New Booking!</h2>
        <p>You have a new booking for <strong>${booking.listing.title}</strong>.</p>
        <p><strong>Guest:</strong> ${booking.user.firstName} ${booking.user.lastName}</p>
        <p><strong>Check-in:</strong> ${checkInDate}</p>
        <p><strong>Check-out:</strong> ${checkOutDate}</p>
        <p><strong>Guests:</strong> ${booking.totalGuests}</p>
        <p><strong>Total:</strong> ₹${booking.totalPrice}</p>
        <p><strong>Booking ID:</strong> ${booking.bookingId}</p>
      </div>
    `;
  }
};

// Send booking confirmation email to user
export const sendBookingConfirmationEmail = async (booking: any): Promise<void> => {
  try {
    const mailOptions = {
      from: `"Nivasa" <${process.env.EMAIL_USER}>`,
      to: booking.user.email,
      subject: `🎉 Booking Confirmed - ${booking.listing.title}`,
      html: getBookingConfirmationTemplate(booking),
    };

    await transporter.sendMail(mailOptions);
    console.log(`Booking confirmation email sent to ${booking.user.email}`);
  } catch (error) {
    console.error("Error sending booking confirmation email:", error);
    throw error;
  }
};

// Send notification email to host
export const sendHostNotificationEmail = async (booking: any): Promise<void> => {
  try {
    const mailOptions = {
      from: `"Nivasa Host" <${process.env.EMAIL_USER}>`,
      to: booking.host.email,
      subject: `🎉 New Booking - ${booking.listing.title}`,
      html: getHostNotificationTemplate(booking),
    };

    await transporter.sendMail(mailOptions);
    console.log(`Host notification email sent to ${booking.host.email}`);
  } catch (error) {
    console.error("Error sending host notification email:", error);
    throw error;
  }
};

// Send booking cancellation email
export const sendBookingCancellationEmail = async (booking: any): Promise<void> => {
  try {
    const mailOptions = {
      from: `"Nivasa" <${process.env.EMAIL_USER}>`,
      to: booking.user.email,
      subject: `Booking Cancelled - ${booking.listing.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #EF4444;">Booking Cancelled</h2>
          <p>Your booking for <strong>${booking.listing.title}</strong> has been cancelled.</p>
          <p><strong>Booking ID:</strong> ${booking.bookingId}</p>
          <p><strong>Reason:</strong> ${booking.cancellationReason || 'No reason provided'}</p>
          <p>If you have any questions, please contact our support team.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Booking cancellation email sent to ${booking.user.email}`);
  } catch (error) {
    console.error("Error sending booking cancellation email:", error);
    throw error;
  }
};