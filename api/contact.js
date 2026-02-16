// netlify/functions/contact.js

const nodemailer = require('nodemailer');

exports.handler = async (event) => {
  // Frontend එකෙන් එන data (name, email, message) අල්ලගන්නවා
  const { name, email, message } = JSON.parse(event.body);

  // Nodemailer transporter එක හදනවා
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // Netlify එකෙන් දෙන password
      pass: process.env.EMAIL_PASS, // Netlify එකෙන් දෙන password
    },
  });

  // Email එක හදනවා
  const mailOptions = {
    from: `"${name}" <${email}>`,
    to: process.env.EMAIL_USER,
    subject: `New Message from Portfolio Contact Form from ${name}`,
    html: `
      <h3>New Contact Form Submission</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `,
  };

  // Email එක යවනවා
  try {
    await transporter.sendMail(mailOptions);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Message sent successfully!" }),
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error sending message." }),
    };
  }
};