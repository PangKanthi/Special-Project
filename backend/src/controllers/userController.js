import UserService from "../services/userService.js";
import bcrypt from "bcryptjs";

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
