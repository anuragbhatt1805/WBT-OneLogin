import nodemailer from 'nodemailer';

export const sendOTP = async (email, name, otp) => {
    const html_data = `<h1>Welcome to OneLogin</h1>\n<hr>\n<h2>Hi ${name},</h2>\n<p>Your OTP is ${otp}</p>\n<p>Use this OTP to verify your email address.</p>\n\n<p>Thanks,</p>\n<p>OneLogin Team</p>`

    try {
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.GMAIL_MAIL,
            to: email,
            subject: 'OTP for Email Verification on OneLogin',
            html: html_data
        };

        const mailInfo = await transporter.sendMail(mailOptions);

        console.log(mailInfo.messageId);
    } catch (err) {
        throw new Error(err.message);
    }
};