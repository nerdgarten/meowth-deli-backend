import emailConfig from "../config/email.js";
import crypto from "crypto";
import { generateVerificationEmail } from "../constant/email/email.js";
import EmailRepository from "../repositories/email.repository.js";
import nodemailer, { Transporter } from "nodemailer";

export default class EmailService {
  private emailRepository: EmailRepository;
  private transporter: Transporter;

  constructor() {
    this.emailRepository = new EmailRepository();
    this.transporter = nodemailer.createTransport({
      host: emailConfig.host,
      port: emailConfig.port,
      secure: emailConfig.secure,
      auth: {
        user: emailConfig.user,
        pass: emailConfig.password,
      },
    });
  }

  async buildToken(userId: number): Promise<string> {
    try {
      const token = crypto.randomBytes(32).toString("hex");
      await this.emailRepository.createToken(
        userId,
        token,
        new Date(Date.now() + 3600000) // 1 hour expiration
      );
      return token;
    } catch (err) {
      throw new Error("Failed to create token");
    }
  }

  async sendEmail(
    from: string,
    to: string,
    subject: string,
    text: string,
    html: string
  ) {
    try {
      const info = await this.transporter.sendMail({
        from: from,
        to: to,
        subject: subject,
        text: text,
        html: html,
      });
      return info;
    } catch (err) {
      throw new Error("Failed to send email");
    }
  }

  async sendVerificationEmail(
    to: string,
    subject: string,
    text: string,
    verificationUrl: string
  ) {
    try {
      const from = `"Meowth Deli" <${emailConfig.user}>`;
      const info = this.sendEmail(
        from,
        to,
        subject,
        text,
        generateVerificationEmail(verificationUrl)
      );
      console.log("Verification email sent: ", info);
    } catch (err) {
      throw new Error("Failed to send email");
    }
  }

  async verifyTokenExists(token: string) {
    try {
      const user = await this.emailRepository.findUniqueToken(token);
      if (!user) throw new Error("Invalid token");
      if (user.expires_at < new Date()) {
        await this.emailRepository.deleteToken(token);
        throw new Error("Token expired");
      }
      await this.emailRepository.deleteToken(token);
      return true;
    } catch (err) {
      throw new Error("Failed to verify token");
    }
  }
}
