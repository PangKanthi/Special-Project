import prisma from "../config/db.js";
import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

class UserService {
  static async getAllUsers() {
    return await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        firstname: true,
        lastname: true,
        email: true,
        phone: true,
        role: true
      }
    });
  }

  static async getUserById(id) {
    console.log("🔍 Checking Database for User ID:", id);
    return await prisma.user.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        username: true,
        firstname: true,
        lastname: true,
        email: true,
        phone: true,
        role: true
      }
    });
  }

  static async getUserPassById(id) {
    console.log("🔍 Checking Database for User ID:", id);
    return await prisma.user.findUnique({
      where: { id: Number(id) },
      select: {
        password: true,
      }
    });
  }

  static async createUser(data) {
    return await prisma.user.create({
      data: {
        username: data.username,
        firstname: data.firstname,
        lastname: data.lastname,
        password: data.password,
        email: data.email,
        phone: data.phone || null,
        role: data.role || "U",
      },
    });
  }

  static async updateUser(id, data) {
    const { id: _, ...updateData } = data;
    return await prisma.user.update({
      where: { id: Number(id) },
      data: {
        username: updateData.username,
        firstname: updateData.firstname,
        lastname: updateData.lastname,
        email: updateData.email,
        phone: updateData.phone,
        role: updateData.role,
      },
    });
  }

  static async updateUserProfile(id, data) {
    console.log(id)
    console.log(data)
    const { id: _, ...updateData } = data;
    return await prisma.user.update({
      where: { id: Number(id) },
      data: {
        firstname: updateData.firstname,
        lastname: updateData.lastname,
        email: updateData.email,
        phone: updateData.phone,
      },
    });
  }

  static async updatePass(id, password){
    return await prisma.user.update({
      where: { id: Number(id) },
      data: {
        password: password,
      },
    });
  }


  static async deleteUser(id) {
    return await prisma.user.delete({ where: { id: Number(id) } });
  }

  static async requestPasswordReset(email) {
    console.log("EMAIL_USER:", process.env.EMAIL_USER);
    console.log("EMAIL_PASS:", process.env.EMAIL_PASS);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("User not found");

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenHash = await bcrypt.hash(resetToken, 10);

    await prisma.user.update({
      where: { email },
      data: {
        resetPasswordToken: resetTokenHash,
        resetPasswordExpires: new Date(Date.now() + 3600000)
      },
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const resetLink = `http://localhost:3000/reset-password?token=${resetToken}&email=${email}`;

    const mailOptions = {
      from: `"test" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset Request",
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`
    };

    await transporter.sendMail(mailOptions);

    return { message: "Reset link sent to email" };
  }

  static async resetPassword(email, token, newPassword) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("Invalid request");

    const tokenValid = await bcrypt.compare(token, user.resetPasswordToken);
    if (!tokenValid || new Date() > new Date(user.resetPasswordExpires)) {
      throw new Error("Invalid or expired token");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword, resetPasswordToken: null, resetPasswordExpires: null },
    });

    return { message: "Password has been reset successfully" };
  }
}



export default UserService;
