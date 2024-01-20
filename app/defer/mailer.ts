import { EmailContent } from "@/types";
import { defer } from "@defer/client";

async function sendEmail(emailContent: EmailContent, emails: string[]) {
  console.log("Inside sendEmail");
  console.log("Emails list:", emails);
  const mailOptions = {
    from: String(process.env.EMAIL_ADDRESS),
    bcc: emails,
    html: emailContent.body,
    subject: emailContent.subject,
  };
  var nodemailer = require('nodemailer');
  var transporter = nodemailer.createTransport({
    host: "smtppro.zoho.in",
    port: 465,
    secure: true, // use SSL
    auth: {
      user: String(process.env.EMAIL_ADDRESS),
      pass: String(process.env.EMAIL_PASSWORD),
    },
  });
  const info = await transporter.sendMail(mailOptions);
  console.log('Email sent Successfully' + info.response);
}

export default defer(sendEmail);
