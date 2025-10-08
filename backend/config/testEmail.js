import dotenv from "dotenv";
dotenv.config();
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendTestEmail = async () => {
  try {
    const msg = {
      to: "btech10270.23@bitmesra.ac.in", // recipient
      from: "connectingcampuses23@gmail.com", // verified sender
      subject: "Testing SendGrid from Connecting Campuses 🚀",
      text: "This is a test email sent from the Connecting Campuses backend using SendGrid!",
      html: "<strong>This is a test email sent from the Connecting Campuses backend using SendGrid!</strong>",
    };

    await sgMail.send(msg);
    console.log("✅ Test email sent successfully!");
  } catch (error) {
    console.error("❌ Error sending test email:", error.response?.body || error);
  }
};

sendTestEmail();
