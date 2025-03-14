const nodemailer = require('nodemailer');
require('dotenv').config();

const sendEmail = async (options) => {
  try {
    // Log environment variables for debugging
    console.log('BREVO_API_KEY:', process.env.BREVO_API_KEY);
    if (!process.env.BREVO_API_KEY) {
      throw new Error('BREVO_API_KEY is not set in the environment variables.');
    }

    // Create a transporter with Brevo's SMTP settings
    const transporter = nodemailer.createTransport({
      host: 'smtp-relay.brevo.com', // Brevo SMTP server
      port: 587,                   // Port for TLS
      secure: false,               // Use TLS instead of SSL
      auth: {
        user: 'apikey',            // Use 'apikey' as the username
        pass: process.env.BREVO_API_KEY, // Your Brevo API key
      },
    });

    // Verify connection configuration
    await new Promise((resolve, reject) => {
      transporter.verify((error, success) => {
        if (error) {
          console.error('SMTP verification failed:', error);
          reject(error);
        } else {
          console.log('SMTP server is ready:', success);
          resolve(success);
        }
      });
    });

    // Define the email options
    const mailOptions = {
      from: 'noiressence01@gmail.com', // Must match a verified sender in Brevo
      to: options.email,
      subject: options.subject,
      text: options.message,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.response);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error; // Re-throw the error for further handling
  }
};
