import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_SEND,
        pass: process.env.EMAIL_PAS,
    }
});

 async function sendVerificationEmail(email: string, token: string): Promise<void> {
    const verificationUrl = `https://scr-bet.onrender.com/api/verify?token=${token}`;
    const mailOptions = {
        from: process.env.EMAIL_SEND,
        to: email,
        subject: 'SCRBet Email Verification',
        html: `<p>Click the link below to verify your email:</p>
           <a href="${verificationUrl}">Verify Email</a>`
    };

     try {
         await transporter.sendMail(mailOptions);
         console.log('Verification email sent successfully');
     } catch (error) {
         console.error('Error sending email:', error);
         throw new Error('Failed to send verification email');
     }
}
export default sendVerificationEmail;