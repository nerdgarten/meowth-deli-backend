import nodemailer, { Transporter } from 'nodemailer';
import database from "../config/db.js";

export default class EmailRepository {
    private transporter: Transporter;

    constructor(
        private host: string,
        private port: number,
        private user: string,
        private password: string
    ) {
        this.transporter = nodemailer.createTransport({
            host: this.host,
            port: this.port,
            secure: this.port === 465, // true for 465, false for other ports
            auth: {
                user: this.user,
                pass: this.password
            },
        });
    }

    async sendEmail(from: string, to: string, subject: string, text: string, html: string) {
        try{
            const info = await this.transporter.sendMail(({
                from: from,
                to: to, //receiver address
                subject: subject,
                text: text,
                html: html, // HTML body
            }));
            return info;
        }catch(err){
            throw new Error("Failed to send email");
        }
    }
    async findUniqueToken(token: string) {
        return database.verifyToken.findUnique({
            where: { token },
        });
    }
    async createToken(userId: number, token: string, expiresAt: Date) {
        return database.verifyToken.create({
            data: {
                user_id: userId,
                token,
                expires_at: expiresAt,
            },
        });
    }
    async deleteToken(token: string) {
        return database.verifyToken.delete({
            where: { token }
        });
    }
}