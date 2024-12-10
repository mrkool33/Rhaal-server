
import nodemailer from 'nodemailer';
const sendVerificationEmail = async (toEmail, verificationCode) => {
    try {
        // Configure the SMTP transporter
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com", // Correct SMTP server for Gmail
            port: 587, // Standard port for TLS
            secure: false, // Use TLS
            auth: {
                user: 'mangoman.utas@gmail.com', // Your Gmail address
                pass: 'tmuy bifi iryo crlj', // Your Gmail app password
            },
        });
        

        // Email content
        const mailOptions = {
            from: `"rahaal" <mangoman.utas@gmail.com>`, // Sender address
            to: toEmail, // Recipient address
            subject: "Email Verification Code",
            text: `Your verification code is: ${verificationCode}`,
            html: `<p>Your verification code is: <strong>${verificationCode}</strong></p>`, // HTML content
        };

        // Send the email
        const info = await transporter.sendMail(mailOptions);

        console.log(`Verification email sent: ${info.messageId}`);
        return { success: true, message: "Verification email sent successfully" };
    } catch (error) {
        console.error("Error sending email:", error);
        return { success: false, message: "Failed to send verification email" };
    }
};

export default sendVerificationEmail;
