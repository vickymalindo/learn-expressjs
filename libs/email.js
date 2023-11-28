import nodemailer from 'nodemailer';

export const sendEmail = async ({ from, to, subject, text }) => {
  try {
    let mailOptions = {
      from,
      to,
      subject,
      text,
    };
    const Transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD_EMAIL,
      },
    });

    return await Transporter.sendMail(mailOptions);
  } catch (error) {
    console.log(error);
  }
};
