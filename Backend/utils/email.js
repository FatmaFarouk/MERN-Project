const nodemailer = require('nodemailer');
require('dotenv').config();
const { createTransport } = require('nodemailer');


const sendEmail = async (options) => {
  try {
    // Create a transporter with Brevo's SMTP settings
    const transporter = createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      secure: false,
      auth: {
          user: "8559ca001@smtp-brevo.com",
          pass: "xsmtpsib-b3f77e21ae60a5fa054c67c1c73ac10fa96166a49cd21c84442850c69e0bb66d-8F2hLpbWKfsCZmPA",
      },
  });

    // Verify connection configuration
    await new Promise((resolve, reject) => {
      transporter.verify((error, success) => {
        if (error) {
          console.error('Transporter error:', error);
          reject(error);
        } else {
          console.log('Server is ready to send emails');
          resolve(success);
        }
      });
    });

    // Define the email options
    const mailOptions = {
      from: 'noiressence01@gmail.com',
      to: options.email,
      subject: options.subject,
      text: options.message,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.response);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

module.exports = sendEmail;
// const nodemailer = require('nodemailer');

// const sendEmail = async options => {
//   // create a transporter
//   const transporter = nodemailer.createTransport({
//     service: 'Brevo',
//     auth: {
//       user: process.env.EMAIL_USERNAME,
//       pass: process.env.EMAIL_PASSWORD
//     }
//   });

// // Verify connection configuration
// transporter.verify(function (error, success) {
//     if (error) {
//       console.log('Transporter error:', error);
//     } else {
//       console.log('Server is ready to send emails');
//     }
//   });

//   // define the email options
//   const mailOptions = {
//     from: 'noiressence01@gmail.com',
//     to: options.email,
//     subject: options.subject,
//     text: options.message
//     // html:
//   };

//   // actually send the email
//   await transporter.sendMail(mailOptions);
// };

// module.exports = sendEmail;
