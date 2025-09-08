import dotenv from 'dotenv';

dotenv.config();

const emailConfig = {
    host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASSWORD

};
export default emailConfig;