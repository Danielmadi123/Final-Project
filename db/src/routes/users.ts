import { Router } from "express";
import { ILogin } from "../@types/user";
import { User } from "../database/model/user";
import { validateLogin } from "../middleware/validation";
import { createUser, validateUser } from "../service/user-service";
import { isAdmin } from "../middleware/is-admin";
import { isAdminOrUser } from "../middleware/is-admin-or-user";
import { Logger } from "../logs/logger";
import LoginAttempt from "../database/schema/LoginAttempt";
import { validateToken } from "../middleware/validate-token";
import { sendEmail } from "../email/sendEmail";
import { generateVerificationCode } from "../middleware/VerificationCode";
import Joi from "joi";
import crypto from "crypto";
import { Token } from "../database/schema/token";
import bcrypt from "bcrypt";
import { Card } from "../database/model/Card";
import {
  sendOrderConfirmationEmail,
  sendContactEmail,
} from "../email/sendEmail";
import ICart from "../database/schema/cart-schema";
const mongoose = require("mongoose");
const router = Router();

const bcryptSalt = process.env.BCRYPT_SALT || 10;

router.get("/", isAdmin, async (req, res, next) => {
  try {
    const allUsers = await User.find();
    res.json(allUsers);
  } catch (error) {
    Logger.error(`Error fetching all users: ${(error as Error).message}`);
    next(error);
  }
});

router.post("/", isAdminOrUser, async (req, res, next) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });

    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User with this email already exists" });
    }

    const { _id, ...userData } = req.body;

    const verificationCode = generateVerificationCode(6);

    userData.verificationCode = verificationCode;

    const newUser = await createUser(userData);

    const welcomeEmailSubject = "Welcome to Our Platform";
    const welcomeEmailText = `Thank you for joining our platform. Your verification code is: ${verificationCode}`;

    await sendEmail(
      newUser._id,
      newUser.email,
      welcomeEmailSubject,
      welcomeEmailText
    );

    const { password, ...rest } = newUser.toObject();
    return res.json({ user: rest, message: "User created successfully" });
  } catch (e) {
    next(e);
  }
});

router.post("/request-new-code", async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ error: "User is already verified" });
    }

    if (user.newCodeRequested) {
      return res.status(400).json({ error: "New code already requested" });
    }

    if (user.verificationTimeout) {
      clearTimeout(user.verificationTimeout);
    }

    const newVerificationCode = generateVerificationCode(6);
    user.verificationCode = newVerificationCode;

    user.newCodeRequested = true;

    await user.save();

    const newVerificationEmailSubject = "New Verification Code";
    const newVerificationEmailText = `Your new verification code is: ${newVerificationCode}`;

    await sendEmail(
      user._id,
      user.email,
      newVerificationEmailSubject,
      newVerificationEmailText
    );

    return res.json({
      message: "New verification code requested",
      userId: user._id,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/verify", async (req, res, next) => {
  try {
    const { verificationCode } = req.body;

    const user = await User.findOne({ verificationCode });

    if (!user) {
      return res
        .status(404)
        .json({ error: "User not found or invalid verification code" });
    }

    const storedVerificationCode = (user.verificationCode ?? "").trim();
    const receivedVerificationCode = verificationCode.trim();

    if (
      storedVerificationCode.toLowerCase() !==
      receivedVerificationCode.toLowerCase()
    ) {
      return res.status(400).json({ error: "Invalid verification code" });
    }

    if (user.isVerified) {
      return res.status(400).json({ error: "User is already verified" });
    }

    if (user.newCodeRequested) {
      try {
        const newVerificationCode = generateVerificationCode(6);
        user.verificationCode = newVerificationCode;
        user.newCodeRequested = false;
        await user.save();

        const newVerificationEmailSubject = "New Verification Code";
        const newVerificationEmailText = `Your previous verification code has expired. Your new verification code is: ${newVerificationCode}`;

        await sendEmail(
          user._id,
          user.email,
          newVerificationEmailSubject,
          newVerificationEmailText
        );

        console.log("New verification code sent:", newVerificationCode);
      } catch (error) {
        console.error("Error updating user for new verification:", error);
      }
    }

    if (user.verificationTimeout) {
      clearTimeout(user.verificationTimeout as NodeJS.Timeout);
      user.verificationTimeout = undefined;
    }

    user.isVerified = true;
    await user.save();

    return res.json({
      message: "User verified successfully",
      userId: user._id,
    });
  } catch (e) {
    next(e);
  }
});

router.get("/:id", isAdminOrUser, async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    const user = await User.findById(id).lean();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { password, ...rest } = user;

    Logger.verbose(`User details retrieved for user: ${id}`);
    res.json({ user: rest });
  } catch (error) {
    Logger.error(`Error fetching user details: ${(error as Error).message}`);
    next(error);
  }
});

router.patch("/:id", isAdmin, validateToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isBusiness } = req.body;

    if (typeof isBusiness !== "boolean") {
      return res.status(400).json({
        error: "'isBusiness' field is required and must be a boolean",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      { _id: id },
      { isBusiness },
      { new: true }
    );

    if (updatedUser) {
      Logger.info(`User updated successfully: ${updatedUser._id}`);
      return res.json(updatedUser);
    } else {
      Logger.warn(`User not found or update did not change any fields`);
      return res
        .status(404)
        .json({ error: "User not found or update did not change any fields" });
    }
  } catch (error) {
    Logger.error(`Error updating user: ${(error as Error).message}`);
    next(error);
  }
});

router.delete("/:id", isAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleteUser = await User.findOneAndDelete({ _id: id });

    if (deleteUser) {
      Logger.verbose(`User deleted successfully: ${id}`);
      return res.json(deleteUser);
    } else {
      Logger.warn(`User not found or delete operation did not occur`);
      return res
        .status(404)
        .json({ error: "User not found or delete operation did not occur" });
    }
  } catch (error) {
    Logger.error(`Error deleting user: ${(error as Error).message}`);
    next(error);
  }
});

router.post("/login", validateLogin, async (req, res, next) => {
  try {
    const { email, password } = req.body as ILogin;

    try {
      const { jwt, isVerified } = await validateUser(email, password);

      if (!isVerified) {
        console.log("User is not verified");
        res.status(401).json({ error: "User is not verified" });
        return;
      }

      console.log(`User login successful: ${email}`);
      res.json({ token: jwt });
    } catch (error) {
      console.error(`Error during login: ${(error as Error).message}`);
      const loginAttemptData = new LoginAttempt({
        email,
        status: "failed",
      });
      await loginAttemptData.save();
      console.warn(`User login failed for: ${email}`);
      res.status(401).json({ error: "Invalid email or password" });
    }
  } catch (error) {
    console.error(
      `Error processing login request: ${(error as Error).message}`
    );
    next(error);
  }
});

router.put("/:id", isAdminOrUser, validateToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateFields = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      { _id: id },
      updateFields,
      { new: true }
    );

    if (updatedUser) {
      Logger.info(`User updated successfully: ${updatedUser._id}`);
      return res.json(updatedUser);
    } else {
      Logger.warn(`User not found or update did not change any fields`);
      return res.status(404).json({
        error: "User not found or update did not change any fields",
      });
    }
  } catch (error) {
    Logger.error(`Error updating user: ${(error as Error).message}`);
    next(error);
  }
});

router.post("/forgot-password", async (req, res) => {
  try {
    const schema = Joi.object({ email: Joi.string().email().required() });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findOne({ email: req.body.email });
    if (!user)
      return res.status(400).send("User with given email doesn't exist");

    let token = await Token.findOne({ userId: user._id });
    if (!token) {
      token = await new Token({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
      }).save();
    }

    const resetLink = `http://localhost:3000/ResetPassword/${user._id}/${token.token}`;

    const emailSubject = "Password Reset";
    const emailBody = `Click the following link to reset your password: ${resetLink}`;

    await sendEmail(user._id, user.email, emailSubject, emailBody);

    res.send("Password reset link sent to your email account");
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).send("An error occurred");
  }
});

router.post("/forgot-password", async (req, res) => {
  try {
    const schema = Joi.object({ email: Joi.string().email().required() });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findOne({ email: req.body.email });
    if (!user)
      return res.status(400).send("User with given email doesn't exist");

    let token = await Token.findOne({ userId: user._id });
    if (!token) {
      token = await new Token({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
      }).save();
    }

    const resetLink = `http://localhost:3000/Reset-password/${user._id}/${token.token}`;

    const emailSubject = "Password Reset";
    const emailBody = `Click the following link to reset your password: ${resetLink}`;

    await sendEmail(user._id, user.email, emailSubject, emailBody);

    res.send("Password reset link sent to your email account");
  } catch (error) {
    Logger.error("An error occurred:", error);
    res.status(500).send("An error occurred");
  }
});

router.post("/reset-password/:userId/:token", async (req, res) => {
  try {
    const { userId, token } = req.params;
    const { password } = req.body;

    Logger.log("Received Reset Password Request:", { userId, token });

    const user = await User.findById(userId);

    if (!user) {
      Logger.error("Invalid user ID:", userId);
      return res.status(400).json({ error: "Invalid link or expired" });
    }

    const tokenRecord = await Token.findOne({ token });

    if (!tokenRecord) {
      Logger.error("Invalid token:", token);
      return res.status(400).json({ error: "Invalid link or expired" });
    }

    if (tokenRecord.expiresAt < new Date()) {
      Logger.error("Token has expired:", tokenRecord.expiresAt);
      await tokenRecord.deleteOne();
      return res.status(400).json({ error: "Token has expired" });
    }

    const hash = await bcrypt.hash(password, 10);
    user.password = hash;
    await user.save();

    Logger.log("Password Reset Successful");

    await tokenRecord.deleteOne();

    return res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    Logger.error("Error resetting password:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/order-confirmation", validateToken, async (req, res) => {
  try {
    const owner = req.user?._id?.toString();
    const userEmail = req.body.userEmail || req.user?.email;

    const cart = await ICart.findOne({ owner });
    if (!cart || cart.items.length === 0) {
      return res.status(404).json({ message: "Cart not found or empty" });
    }

    let totalPrice = 0;
    const orderItems = cart.items.map((item) => {
      const itemTotal = item.price * item.quantity;
      totalPrice += itemTotal;
      return {
        title: item.name,
        price: item.price,
        quantity: item.quantity,
        shipping: item.shipping,
        imageUrl:
          item.images && item.images.length > 0
            ? item.images[0].url
            : undefined,
        subtotal: itemTotal,
      };
    });

    await sendOrderConfirmationEmail(userEmail, orderItems, totalPrice);

    cart.items = [];
    cart.bill = 0;
    await cart.save();

    res
      .status(200)
      .json({ message: "Order confirmation email sent successfully" });
  } catch (error) {
    console.error("Error sending order confirmation email:", error);
    res.status(500).json({ error: "Error sending order confirmation email" });
  }
});

router.post("/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!email || !message) {
      return res
        .status(400)
        .json({ message: "Email and message are required." });
    }

    await sendContactEmail(email, `Message from ${name}`, message);
    res
      .status(200)
      .json({ message: "Your message has been sent successfully." });
  } catch (error) {
    console.error("Error sending contact email:", error);
    res.status(500).json({ message: "Failed to send message." });
  }
});

export { router as usersRouter };
