/**
 * Email notification service for waitlist registrations
 * 
 * This module supports multiple email providers:
 * - Resend (recommended for production)
 * - SMTP via nodemailer
 * - Custom email service
 * 
 * Set the EMAIL_PROVIDER environment variable to choose the provider.
 */
import nodemailer from 'nodemailer';

interface WaitlistEntry {
  name: string;
  email: string;
  researchInterests: string;
  createdAt: Date;
}

/**
 * Sends email notification when someone joins the waitlist
 */
export async function sendWaitlistNotification(entry: WaitlistEntry): Promise<void> {
  const emailProvider = process.env.EMAIL_PROVIDER || 'none';

  switch (emailProvider) {
    case 'resend':
      await sendViaResend(entry);
      break;
    case 'smtp':
      await sendViaSMTP(entry);
      break;
    case 'none':
    default:
      // No email service configured - just log
      console.log('Email notification (not sent):', {
        to: process.env.ADMIN_EMAIL || 'admin@example.com',
        subject: 'New Waitlist Registration',
        entry,
      });
      break;
  }
}

/**
 * Send email via Resend (https://resend.com)
 * Requires: RESEND_API_KEY environment variable
 */
async function sendViaResend(entry: WaitlistEntry): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not configured');
  }

  const adminEmail = process.env.ADMIN_EMAIL || process.env.FROM_EMAIL;
  if (!adminEmail) {
    throw new Error('ADMIN_EMAIL or FROM_EMAIL is not configured');
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: process.env.FROM_EMAIL || 'Konecbo <noreply@konecbo.com>',
        to: [adminEmail],
        subject: 'New Waitlist Registration - Konecbo',
        html: generateEmailHTML(entry),
        text: generateEmailText(entry),
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Resend API error: ${JSON.stringify(error)}`);
    }
  } catch (error) {
    console.error('Resend email error:', error);
    throw error;
  }
}

/**
 * Send email via SMTP (requires nodemailer)
 * Requires: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD environment variables
 */
async function sendViaSMTP(entry: WaitlistEntry): Promise<void> {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, ADMIN_EMAIL, FROM_EMAIL } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASSWORD) {
    throw new Error('SMTP environment variables are not fully configured');
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: parseInt(SMTP_PORT, 10),
    secure: parseInt(SMTP_PORT, 10) === 465, // true for 465, false for other ports
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASSWORD,
    },
  });

  const adminEmail = ADMIN_EMAIL || FROM_EMAIL;
  if (!adminEmail) {
    throw new Error('ADMIN_EMAIL or FROM_EMAIL is not configured');
  }

  try {
    await transporter.sendMail({
      from: FROM_EMAIL || 'Konecbo <noreply@konecbo.com>',
      to: adminEmail,
      subject: 'New Waitlist Registration - Konecbo',
      html: generateEmailHTML(entry),
      text: generateEmailText(entry),
    });

    console.log('SMTP email sent successfully');
  } catch (error) {
    console.error('SMTP email error:', error);
    throw error;
  }
}

/**
 * Generate HTML email content
 */
function generateEmailHTML(entry: WaitlistEntry): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4F46E5; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 20px; border-radius: 0 0 8px 8px; }
          .field { margin: 15px 0; }
          .label { font-weight: bold; color: #4F46E5; }
          .value { margin-top: 5px; padding: 10px; background: white; border-radius: 4px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Waitlist Registration</h1>
          </div>
          <div class="content">
            <div class="field">
              <div class="label">Name:</div>
              <div class="value">${escapeHtml(entry.name)}</div>
            </div>
            <div class="field">
              <div class="label">Email:</div>
              <div class="value">${escapeHtml(entry.email)}</div>
            </div>
            <div class="field">
              <div class="label">Research Interests:</div>
              <div class="value">${escapeHtml(entry.researchInterests)}</div>
            </div>
            <div class="field">
              <div class="label">Registered At:</div>
              <div class="value">${entry.createdAt.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
}

/**
 * Generate plain text email content
 */
function generateEmailText(entry: WaitlistEntry): string {
  return `
New Waitlist Registration - Konecbo

Name: ${entry.name}
Email: ${entry.email}
Research Interests: ${entry.researchInterests}
Registered At: ${entry.createdAt.toLocaleString()}
  `.trim();
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"\']/g, (m) => map[m]);
}
