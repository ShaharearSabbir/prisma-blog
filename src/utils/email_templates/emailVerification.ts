interface EmailTemplate {
  html: string;
  text: string;
}

/**
 * Generates both HTML and Plain Text versions of the verification email.
 */
export const generateVerificationEmail = (
  userName: string,
  verificationUrl: string,
): EmailTemplate => {
  const year = new Date().getFullYear();

  // 1. Plain Text Version (Essential for accessibility and spam filters)
  const text = `
Hello ${userName},

Welcome to our platform! Please verify your email address by visiting the link below:

${verificationUrl}

If you didn't sign up for this account, you can safely ignore this email.

© ${year} Your Company. All rights reserved.
  `.trim();

  // 2. Modern HTML Version
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9fafb; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
            .wrapper { width: 100%; table-layout: fixed; background-color: #f9fafb; padding-bottom: 40px; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; margin-top: 40px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); }
            .header { background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 40px 20px; text-align: center; }
            .header h1 { color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.025em; }
            .content { padding: 40px; color: #1f2937; line-height: 1.6; }
            .content p { margin-bottom: 20px; font-size: 16px; }
            .cta-container { text-align: center; margin: 35px 0; }
            .button { background-color: #4f46e5; color: #ffffff !important; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; display: inline-block; transition: background-color 0.2s; }
            .link-fallback { font-size: 12px; color: #6b7280; word-break: break-all; margin-top: 25px; padding: 15px; background-color: #f3f4f6; border-radius: 8px; }
            .footer { text-align: center; padding: 25px; font-size: 13px; color: #9ca3af; }
        </style>
    </head>
    <body>
        <div class="wrapper">
            <div class="container">
                <div class="header">
                    <h1>Verify Your Identity</h1>
                </div>
                <div class="content">
                    <p>Hi <strong>${userName}</strong>,</p>
                    <p>Thanks for joining! We're thrilled to have you. To finish setting up your account and ensure your security, please click the button below to verify your email address.</p>
                    
                    <div class="cta-container">
                        <a href="${verificationUrl}" class="button">Verify Email Address</a>
                    </div>

                    <p>This link will expire in 24 hours.</p>

                    <div class="link-fallback">
                        <strong>Having trouble?</strong> Copy and paste this URL into your browser:<br/>
                        <a href="${verificationUrl}" style="color: #4f46e5;">${verificationUrl}</a>
                    </div>
                </div>
                <div class="footer">
                    <p>&copy; ${year} Your Company Inc. <br/> 123 Innovation Way, Tech City.</p>
                    <p>You received this email because you signed up for an account. If this wasn't you, please ignore this email.</p>
                </div>
            </div>
        </div>
    </body>
    </html>
  `;

  return { html, text };
};

export default generateVerificationEmail;
