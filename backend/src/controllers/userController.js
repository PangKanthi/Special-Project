import UserService from "../services/userService.js";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await UserService.getAllUsers();
    res.json(users);
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await UserService.getUserById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = await UserService.createUser({ ...req.body, password: hashedPassword });
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }
    const updatedUser = await UserService.updateUser(req.params.id, req.body);
    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    await UserService.deleteUser(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const requestPasswordReset = async (req, res, next) => {
  console.log("EMAIL_USER:", process.env.EMAIL_USER);
  console.log("EMAIL_PASS:", process.env.EMAIL_PASS);

  try {
    const { email } = req.body;
    const response = await UserService.requestPasswordReset(email);
    res.json(response);
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { email, token, newPassword } = req.body;
    const response = await UserService.resetPassword(email, token, newPassword);
    res.json(response);
  } catch (error) {
    next(error);
  }
};

export const getUserProfile = async (req, res) => {

  try {
    console.log("🔍 req.user:", req.user);  // ✅ ตรวจสอบค่า user

    if (!req.user || !req.user.id) {
      return res.status(400).json({ error: "User ID is missing in request" });
    }

    const userId = Number(req.user.id);
    console.log("🆔 User ID:", userId);  // ✅ ตรวจสอบค่า ID

    const user = await UserService.getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      id: user.id,
      username: user.username,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      phone: user.phone,
    });

  }
  catch (error) {
    console.error("[ERROR] Failed to fetch user profile:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};






