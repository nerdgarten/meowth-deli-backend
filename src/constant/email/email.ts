export const generateVerificationEmail = (verificationUrl: string) => {
    return `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; border: 1px solid #eee; padding: 24px;">
            <h2 style="color: #4f46e5;">Meowth Deli Email Verification</h2>
            <p>Hello,</p>
            <p>Thank you for registering. Please verify your email address by clicking the button below:</p>
            <p style="text-align: center;">
                <a href="${verificationUrl}" style="background: #4f46e5; color: #fff; padding: 12px 24px; border-radius: 6px; text-decoration: none; display: inline-block;">
                    Verify Email
                </a>
            </p>
            <p>If you did not request this, you can ignore this email.</p>
            <hr style="margin: 24px 0;">
            <small style="color: #888;">&copy; ${new Date().getFullYear()} Meowth Deli</small>
        </div>
    `;
};
