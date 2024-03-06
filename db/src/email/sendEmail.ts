import nodemailer from "nodemailer";
import { emailConfig } from "../config/email.config";

const transporter = nodemailer.createTransport(emailConfig);

export async function sendEmail(
  userId: string,
  to: string,
  subject: string,
  message: string 
): Promise<void> {
  if (!to) {
    console.error("Error sending email: No recipients defined");
    throw new Error("No recipients defined");
  }

  const mailOptions = {
    from: emailConfig.auth.user,
    to: to,
    subject: subject,
    text: message, 
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info);
  } catch (error: any) {
    if (error.code === "EAUTH" && error.command === "API") {
      console.log("Credentials issue. Responding with 200 status.");
      return;
    }

    console.error("Error sending email:", error);
    throw error;
  }
}

interface ICartItem {
  title: string;
  price: number;
  quantity: number;
  shipping: string;
  imageUrl?: string;
}

export const sendOrderConfirmationEmail = async (
  userEmail: string,
  orderDetails: ICartItem[],
  totalPrice: number
): Promise<void> => {
  try {
    let transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "hanilzx8@gmail.com", 
        pass: "lsxmfadqtncpnrhw",
      },
    });

    const htmlContent = `
    <h1>Order Confirmation</h1>
    <p>Thank you for your order! Here are the details:</p>
    <ul>
      ${orderDetails
        .map(
          (item) => `
        <li>
          <strong>${item.title}</strong><br>
          Price: $${item.price.toFixed(2)}<br>
          Quantity: ${item.quantity}<br>
          Shipping: ${item.shipping}<br>
          <img src="${item.imageUrl}" alt="${
            item.title
          }" width="100" height="100"> <!-- Include image URL -->
        </li>
      `
        )
        .join("")}
    </ul>
    <p>Total Price: $${totalPrice.toFixed(2)}</p>`;

    let info = await transporter.sendMail({
      from: "hanilzx8@gmail.com", 
      to: userEmail, 
      subject: "Order Confirmation", 
      html: htmlContent, 
    });

    console.log("Order confirmation email sent:", info.messageId);
  } catch (error) {
    console.error("Error sending order confirmation email:", error);
    throw new Error("Error sending order confirmation email");
  }
};

export const sendContactEmail = async (
  from: string,
  subject: string,
  message: string
): Promise<void> => {
  const to = "hanilzx8@gmail.com";

  await sendEmail("contact-form", to, subject, message);
};
