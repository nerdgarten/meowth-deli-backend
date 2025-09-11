import crypto from "crypto";

import { StatusCodes } from "http-status-codes";
import { Transporter, createTransport } from "nodemailer";

import emailConfig from "@/config/email";
import { generateVerificationEmail } from "@/constant/email/email";
import EmailRepository from "@/repositories/email.repository";
import { AppError } from "@/types/error";

export default class EmailService {
  private emailRepository: EmailRepository;
  private transporter: Transporter;

  constructor() {
    this.emailRepository = new EmailRepository();
    this.transporter = createTransport({
      host: emailConfig.host,
      port: emailConfig.port,
      secure: emailConfig.secure, // true for 465, false for other ports
      auth: {
        user: emailConfig.user,
        pass: emailConfig.password,
      },
    });
  }

  async buildToken(userId: number): Promise<string> {
    const token = crypto.randomBytes(32).toString("hex");
    await this.emailRepository.createToken(
      userId,
      token,
      new Date(Date.now() + 3600000) // 1 hour expiration
    );
    return token;
  }

  async sendEmail(
    from: string,
    to: string,
    subject: string,
    text: string,
    html: string
  ) {
    const info = await this.transporter.sendMail({
      from: from,
      to: to,
      subject: subject,
      text: text,
      html: html,
    });
    return info;
  }

  async sendVerificationEmail(
    to: string,
    subject: string,
    text: string,
    verificationUrl: string
  ) {
    const from = `"Meowth Deli" <${emailConfig.user}>`;
    const info = this.sendEmail(
      from,
      to,
      subject,
      text,
      generateVerificationEmail(verificationUrl)
    );
    console.log("Verification email sent: ", info);
  }

  async verifyTokenExists(token: string) {
    const user = await this.emailRepository.findUniqueToken(token);
    if (!user) {
      throw new AppError("Invalid token", StatusCodes.BAD_REQUEST);
    }
    if (user.expires_at < new Date()) {
      await this.emailRepository.deleteToken(token);
      throw new AppError("Token expired", StatusCodes.BAD_REQUEST);
    }
    await this.emailRepository.deleteToken(token);
  }
}
