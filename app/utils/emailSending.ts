import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const SMTP_HOST = "smtp.gmail.com";
const SMTP_PORT = 587;

export const createTransporter = () => {
   return nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      auth: {
         user: SMTP_USER,
         pass: SMTP_PASS,
      },
      secure: false,
   });
};

// Method to send OTP email
export const sendOtpEmail = async (email: string, otp: string): Promise<void> => {
   const transporter = createTransporter();

   const mailOptions = {
      from: `"Dare to Donate" <${SMTP_USER}>`,
      to: email,
      subject: "Verify Your Email - One-Time Password (OTP)",
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4; border-radius: 10px;">
        <div style="background-color: #e74c3c; padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="color: #ffffff; margin: 0;">Verify Your Email</h1>
        </div>
        <div style="background-color: #ffffff; padding: 20px; border-radius: 0 0 10px 10px;">
          <p style="font-size: 16px; color: #333333;">Dear User,</p>
          <p style="font-size: 16px; color: #333333;">Thank you for registering with <strong>Dare to Donate</strong>. To complete your email verification, please enter the following One-Time Password (OTP):</p>
          <div style="background-color: #e74c3c; color: #ffffff; font-size: 24px; font-weight: bold; text-align: center; padding: 10px; margin: 20px 0; border-radius: 5px;">
            ${otp}
          </div>
          <p style="font-size: 16px; color: #333333;">This OTP is valid for <strong>10 minutes</strong>. Please do not share it with anyone.</p>
          <p style="font-size: 16px; color: #333333;">If you did not request this verification, please disregard this email.</p>
          <p style="font-size: 16px; color: #333333;">We appreciate your commitment to saving lives through blood donation.</p>
          <p style="font-size: 16px; color: #333333;">Best regards,<br><strong>The Dare to Donate Team</strong></p>
        </div>
        <div style="text-align: center; margin-top: 20px; color: #888888; font-size: 14px;">
          <p>This is an automated message. Please do not reply.</p>
        </div>
      </div>
    `,
   };
   await transporter.sendMail(mailOptions);
};
