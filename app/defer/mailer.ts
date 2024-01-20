import { EmailContent } from "@/types";
import nodemailer from "nodemailer";
import { defer } from "@defer/client";

var transporter = nodemailer.createTransport ({
    host: 'smtppro.zoho.in',
    port: 465,
    secure: true, // use SSL
    auth:{
      user: String(process.env.EMAIL_ADDRESS),
      pass: String(process.env.EMAIL_PASSWORD)
  },
  });
  async function sendEmail(emailContent: EmailContent, emails: string[]) {
      const mailOptions = {
          from: String(process.env.EMAIL_ADDRESS),
          bcc: emails,
          html: emailContent.body,
          subject: emailContent.subject,
      }
      transporter.sendMail(mailOptions, (error: any, info: any) => {
          if(error) return console.log(error);
          
          console.log('Email sent: ', info);
        })
  }

  export default defer(sendEmail);