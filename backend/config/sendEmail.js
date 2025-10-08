import dotenv from "dotenv";
import sgMail from "@sendgrid/mail";

dotenv.config();

// Set SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * sendEmail
 * Sends a professional email using SendGrid.
 *
 * @param {Object} options
 * @param {string} options.to - Recipient email address
 * @param {string} options.subject - Email subject
 * @param {string} options.text - Plain text content
 * @param {string} [options.html] - Optional HTML content
 */
const sendEmail = async ({ to, subject, text, html }) => {
  const message = {
    to,
    from: {
      email: "connectingcampuses23@gmail.com", // verified sender
      name: "Connecting Campuses",
    },
    subject,
    text,
    html: html || `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #4f46e5;">Connecting Campuses</h2>
        <p>Hi there,</p>
        <p>${text}</p>
        <p style="margin-top: 20px;">Regards,<br/><strong>Connecting Campuses Team</strong></p>
        <hr style="margin-top: 30px; border: none; border-top: 1px solid #ddd;" />
        <p style="font-size: 12px; color: #999;">
          This is an automated message from Connecting Campuses. Please do not reply to this email.<br/>
          © ${new Date().getFullYear()} Connecting Campuses | BIT Mesra
        </p>
      </div>
    `,
  };

  try {
    await sgMail.send(message);
    console.log(`✅ Email sent successfully to ${to}`);
  } catch (error) {
    console.error(
      `❌ Failed to send email to ${to}:`,
      error.response?.body || error
    );
  }
};

export default sendEmail;
