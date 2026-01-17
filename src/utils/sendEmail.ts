import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false, // Use true for port 465, false for port 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (
  email: string,
  subject: string,
  html: string,
  text: string,
) => {
  const info = await transporter.sendMail({
    from: '"Prisma Blog" <noreply@brismablog.com>',
    to: email,
    subject: subject,
    text: text, // Plain-text version of the message
    html: html, // HTML version of the message
  });

  console.log("Message sent:", info.messageId);
};

export default sendEmail;
