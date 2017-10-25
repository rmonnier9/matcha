const nodemailer = require('nodemailer');

const stmp = 'smtps://api.matcha@laposte.net:Apimatcha75@smtp.laposte.net';
const transporter = nodemailer.createTransport(stmp);

const mail = (to, subject, text) => {
  const mailOptions = {
    from: '"Api Matcha" <api.matcha@laposte.net>',
    to,
    subject,
    text,
  };
  transporter.sendMail(mailOptions, (error) => {
    if (error) { console.log(error); }
  });
};

module.exports = mail;
