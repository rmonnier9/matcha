import nodemailer from 'nodemailer';

const stmp = 'smtps://api.matcha@laposte.net:Apimatcha75@smtp.laposte.net';
const transporter = nodemailer.createTransport(stmp);

const mail = (to, subject, text) => {
  const mailOptions = {
    from: '"Api Matcha" <api.matcha@laposte.net>',
    to,
    subject,
    text,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) { console.log(error); return; }
    console.log('Message %s sent: %s', info.messageId, info.response);
  });
};

export default mail;
