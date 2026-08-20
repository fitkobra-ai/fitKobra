export interface WelcomeEmailData {
  userName: string;
  userEmail: string;
  referralCode: string;
}

export function getWelcomeEmailTemplate(userName: string, referralCode: string = 'FITKOBRA-7A2F'): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #0f172a; color: #ffffff; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background-color: #1e293b; border-radius: 16px; padding: 32px; border: 1px solid #334155; }
          .logo { font-size: 28px; font-weight: bold; color: #3b82f6; text-align: center; margin-bottom: 24px; }
          .title { font-size: 22px; font-weight: bold; color: #ffffff; margin-bottom: 16px; }
          .body-text { font-size: 16px; line-height: 1.6; color: #94a3b8; margin-bottom: 24px; }
          .code-box { background-color: #0f172a; border: 2px dashed #3b82f6; border-radius: 12px; padding: 16px; text-align: center; margin: 24px 0; }
          .code-title { font-size: 12px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; }
          .code { font-size: 26px; font-weight: 900; color: #60a5fa; letter-spacing: 2px; margin-top: 4px; }
          .btn { display: inline-block; background-color: #3b82f6; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 10px; font-weight: bold; text-align: center; }
          .footer { text-align: center; margin-top: 32px; font-size: 12px; color: #64748b; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">💪 FitKobra AI</div>
          <div class="title">Welcome to FitKobra, ${userName}! 🚀</div>
          <div class="text">
            Thank you for joining FitKobra! We are thrilled to help you hit your fitness, muscle building, and nutrition targets.
          </div>
          <div class="card">
            <p style="margin: 0; font-size: 13px; color: #8b949e;">YOUR REFERRAL CODE</p>
            <div class="code">${referralCode}</div>
            <p style="margin: 8px 0 0 0; font-size: 13px; color: #8b949e;">
              Share this code with your friends! When they join, you both get <strong>+10 AI Credits</strong>.
            </p>
          </div>
          <div class="text">
            Log your workouts, track your meals with AI vision, and chat with your AI Coach anytime inside the app.
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://fitkobra.com" class="btn">Launch FitKobra AI App</a>
          </div>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} FitKobra AI Inc. All rights reserved.<br>
          If you did not sign up for FitKobra, please ignore this email.
        </div>
        </div>
      </body>
    </html>
  `;
}

/**
 * Generates an automated Welcome Email HTML template and notification log for new users.
 */
export async function sendWelcomeEmail(data: WelcomeEmailData): Promise<boolean> {
  const emailHtml = getWelcomeEmailTemplate(data.userName, data.referralCode);
  console.log(`[Email Service] Welcome email notification queued for ${data.userEmail} with code ${data.referralCode}`);
  return true;
}
