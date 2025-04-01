import nodemailer from 'nodemailer';

// Interface to define the email message structure
export interface EmailMessage {
  to: string;
  from: string;
  subject: string;
  text: string;
  html?: string;
}

/**
 * Creates a transporter for sending emails
 * For production, use real SMTP credentials
 * For development/demo, we'll use a preview service
 */
export async function createTransporter() {
  // In production, you would use real SMTP credentials
  if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  // For development/demo, use ethereal.email
  const testAccount = await nodemailer.createTestAccount();
  
  console.log('Created test email account:', testAccount.user);
  
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
}

/**
 * Sends an email using the configured transporter
 * @param message The email message to send
 * @returns Information about the sent email
 */
export async function sendEmail(message: EmailMessage) {
  const transporter = await createTransporter();
  
  const info = await transporter.sendMail({
    from: message.from,
    to: message.to,
    subject: message.subject,
    text: message.text,
    html: message.html || message.text.replace(/\n/g, '<br>'),
  });
  
  console.log('Message sent: %s', info.messageId);
  
  // Only log preview URL in development mode
  if (!process.env.EMAIL_HOST) {
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  }
  
  return {
    messageId: info.messageId,
    previewUrl: nodemailer.getTestMessageUrl(info),
  };
}

/**
 * Formats a contact form submission into an email message
 * @param data Contact form data
 * @param recipient Email address to send the contact message to
 * @returns Formatted email message
 */
export function formatContactEmail(data: { 
  name: string; 
  email: string; 
  subject: string; 
  message: string;
}, recipient: string) {
  const text = `
New contact form submission from ${data.name}

From: ${data.name} <${data.email}>
Subject: ${data.subject}

Message:
${data.message}
`;

  const html = `
<h2>New contact form submission</h2>
<p><strong>From:</strong> ${data.name} &lt;${data.email}&gt;</p>
<p><strong>Subject:</strong> ${data.subject}</p>
<h3>Message:</h3>
<p>${data.message.replace(/\n/g, '<br>')}</p>
`;

  return {
    to: recipient,
    from: `"Portfolio Contact Form" <${data.email}>`,
    subject: `Contact Form: ${data.subject}`,
    text,
    html,
  };
}