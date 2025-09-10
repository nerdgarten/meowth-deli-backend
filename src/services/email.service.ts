import nodemailer from 'nodemailer';
import emailConfig from '../config/email.js';
import crypto from 'crypto';
import database from "../config/db.js";
import { generateVerificationEmail } from '../constant/email/email.js';
import EmailRepository from '../repositories/email.repository.js';

export default class EmailService {
    private emailRepository: EmailRepository;
    constructor() {
        this.emailRepository = new EmailRepository(
            emailConfig.host,
            emailConfig.port,
            emailConfig.user,
            emailConfig.password
        );
    }
    async buildToken(userId: number): Promise<string> {
        const token = crypto.randomBytes(32).toString('hex');
        await this.emailRepository.createToken(userId, token, new Date(Date.now() + 3600000)); // 1 hour expiration
        return token
    }
    async sendVerfifationEmail(to: string, subject: string, text: string, verificationUrl: string){
        try{
            const from = `"Meowth Deli" <${emailConfig.user}>`
            const info = this.emailRepository.sendEmail(from, to, subject, text, generateVerificationEmail(verificationUrl));
            console.log("Verification email sent: ", info);
        }catch(err){
            throw new Error("Failed to send email");
        }
    }
    async verifyTokenExists(token: string) {
        try{
            const user = await this.emailRepository.findUniqueToken(token);
            if(!user) throw new Error("Invalid token");
            if(user.expires_at < new Date()) {
                await this.emailRepository.deleteToken(token);
                throw new Error("Token expired");
            }
            await this.emailRepository.deleteToken(token);
            return true
        }catch(err){
            throw new Error("Failed to verify token");
        }
    }

}