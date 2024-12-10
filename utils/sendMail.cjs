require("dotenv").config();
const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");

const sendMail = async (options) => {
  try{
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    service: process.env.SMTP_SERVICE,
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const { email, subject, template, data } = options;
  const emailTemplate = path.join(__dirname, "../emails", template);
  const html = await ejs.renderFile(emailTemplate, data);

  const mailOptions = {
    from: `"rahaal" ${process.env.SMTP_MAIL}` ,
    to: email,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
  return { success: true, message: "Verification email sent successfully" };
}
  catch (error) {
    console.error("Error sending email:", error);
    return { success: false, message: "Failed to send verification email" };
}
};

module.exports = sendMail;
