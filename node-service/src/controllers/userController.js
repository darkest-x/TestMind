/**
 * User controller for TestMind API
 */

const userService = require('../services/userService');
const { User, CreateUserRequest, UpdateUserRequest, ApiResponse } = require('../models');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await userService.findAllUsers();
    res.json(ApiResponse.success(users));
  } catch (error) {
    res.status(500).json(ApiResponse.error(error.message));
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userService.findUserById(parseInt(id));
    if (!user) {
      return res.status(404).json(ApiResponse.error('User not found'));
    }
    res.json(ApiResponse.success(user));
  } catch (error) {
    res.status(500).json(ApiResponse.error(error.message));
  }
};

exports.getUserByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await userService.findUserByEmail(email);
    if (!user) {
      return res.status(404).json(ApiResponse.error('User not found'));
    }
    res.json(ApiResponse.success(user));
  } catch (error) {
    res.status(500).json(ApiResponse.error(error.message));
  }
};

exports.getUserByUsername = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await userService.findUserByUsername(username);
    if (!user) {
      return res.status(404).json(ApiResponse.error('User not found'));
    }
    res.json(ApiResponse.success(user));
  } catch (error) {
    res.status(500).json(ApiResponse.error(error.message));
  }
};

exports.searchUsers = async (req, res) => {
  try {
    const { keyword } = req.query;
    const users = await userService.searchUsers(keyword);
    res.json(ApiResponse.success(users));
  } catch (error) {
    res.status(500).json(ApiResponse.error(error.message));
  }
};

exports.getActiveUsers = async (req, res) => {
  try {
    const users = await userService.findActiveUsers();
    res.json(ApiResponse.success(users));
  } catch (error) {
    res.status(500).json(ApiResponse.error(error.message));
  }
};

exports.getRecentUsers = async (req, res) => {
  try {
    const users = await userService.findRecentUsers();
    res.json(ApiResponse.success(users));
  } catch (error) {
    res.status(500).json(ApiResponse.error(error.message));
  }
};

exports.getUserCount = async (req, res) => {
  try {
    const count = await userService.getUserCount();
    res.json(ApiResponse.success(count));
  } catch (error) {
    res.status(500).json(ApiResponse.error(error.message));
  }
};

exports.createUser = async (req, res) => {
  try {
    const userData = req.body;
    const user = await userService.createUser(userData);
    res.status(201).json(ApiResponse.success(user));
  } catch (error) {
    if (error.message.includes('already exists')) {
      return res.status(409).json(ApiResponse.error(error.message));
    }
    res.status(500).json(ApiResponse.error(error.message));
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userData = req.body;
    const user = await userService.updateUser(parseInt(id), userData);
    res.json(ApiResponse.success(user));
  } catch (error) {
    if (error.message.includes('not found')) {
      return res.status(404).json(ApiResponse.error(error.message));
    }
    if (error.message.includes('already exists')) {
      return res.status(409).json(ApiResponse.error(error.message));
    }
    res.status(500).json(ApiResponse.error(error.message));
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await userService.deleteUser(parseInt(id));
    res.json(ApiResponse.success(null));
  } catch (error) {
    if (error.message.includes('not found')) {
      return res.status(404).json(ApiResponse.error(error.message));
    }
    res.status(500).json(ApiResponse.error(error.message));
  }
};

exports.activateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userService.activateUser(parseInt(id));
    res.json(ApiResponse.success(user));
  } catch (error) {
    if (error.message.includes('not found')) {
      return res.status(404).json(ApiResponse.error(error.message));
    }
    res.status(500).json(ApiResponse.error(error.message));
  }
};

exports.deactivateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userService.deactivateUser(parseInt(id));
    res.json(ApiResponse.success(user));
  } catch (error) {
    if (error.message.includes('not found')) {
      return res.status(404).json(ApiResponse.error(error.message));
    }
    res.status(500).json(ApiResponse.error(error.message));
  }
};
