const fs = require('fs');

const content = `import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export const sendEmail = async (options: EmailOptions) => {
  // Use environment variables or fallback to a mock/console behavior
  const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASSWORD, EMAIL_FROM, NODE_ENV } = process.env;

  if (!EMAIL_HOST || !EMAIL_USER || !EMAIL_PASSWORD) {
    console.warn('?? EMAIL CONFIGURATION MISSING. Simulating email in development console.');
    console.log('----------------------------------------------------');
    console.log(\`To: \${options.to}\`);
    console.log(\`Subject: \${options.subject}\`);
    console.log(\`Body: \${options.text}\`);
    console.log('----------------------------------------------------');
    return;
  }

  const transporter = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: parseInt(EMAIL_PORT || '587', 10),
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: EMAIL_FROM || 'noreply@capacityconnect.com',
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
  };

  await transporter.sendMail(mailOptions);
};
`;

if (!fs.existsSync('server/services')) {
  fs.mkdirSync('server/services', { recursive: true });
}
fs.writeFileSync('server/services/emailService.ts', content, 'utf8');
