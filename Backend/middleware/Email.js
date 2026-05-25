import {
  Verification_Email_Template,
  Welcome_Email_Template,
} from "../config/EmailTemplate.js";
import { transporter } from "./EmailConfig.js";

export const sendVerificationCode = async (email, verificationCode) => {
  try {
    const response = await transporter.sendMail({
      from: '"MediCare" <kaifarshad07@gmail.com>',
      to: email,
      subject: "Verify your Email",
      text: "Hello world?", // plain‑text body
      html: Verification_Email_Template.replace(
        "{verificationCode}",
        verificationCode
      ), // HTML body
    });
    console.log("Email sent successfully! ", response);
  } catch (error) {
    // Helper shouldn't reference `res` (not in scope here). Log and return null.
    console.log("Error sending verification email:", error);
    return null;
  }
};

export const WelcomeEmail = async (email, name) => {
  try {
    const response = await transporter.sendMail({
      from: '"MediCare" <kaifarshad07@gmail.com>',
      to: email,
      subject: "Welcome To Our Community",
      text: "Hello world?", // plain‑text body
      html: Welcome_Email_Template.replace("{name}", name), // HTML body
    });
    console.log("Email sent successfully! ", response);
  } catch (error) {
    console.log(error);
  }
};
