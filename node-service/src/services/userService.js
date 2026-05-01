/**
 * User service for TestMind API
 */

const { User } = require('../models');

let users = [
  new User(1, 'admin', 'admin@testmind.com', 'password123', 'Admin', 'User', true),
  new User(2, 'johndoe', 'john@testmind.com', 'password123', 'John', 'Doe', true),
  new User(3, 'janedoe', 'jane@testmind.com', 'password123', 'Jane', 'Doe', false)
];

let nextId = 4;

exports.findAllUsers = async () => {
  return users;
};

exports.findUserById = async (id) => {
  return users.find(u => u.id === id);
};

exports.findUserByEmail = async (email) => {
  return users.find(u => u.email === email);
};

exports.findUserByUsername = async (username) => {
  return users.find(u => u.username === username);
};

exports.searchUsers = async (keyword) => {
  const lowerKeyword = keyword.toLowerCase();
  return users.filter(u =>
    u.username.toLowerCase().includes(lowerKeyword) ||
    u.email.toLowerCase().includes(lowerKeyword) ||
    (u.firstName && u.firstName.toLowerCase().includes(lowerKeyword)) ||
    (u.lastName && u.lastName.toLowerCase().includes(lowerKeyword))
  );
};

exports.findActiveUsers = async () => {
  return users.filter(u => u.active);
};

exports.findRecentUsers = async () => {
  return users.slice(0, 10);
};

exports.getUserCount = async () => {
  return users.length;
};

exports.createUser = async (userData) => {
  const existingEmail = users.find(u => u.email === userData.email);
  if (existingEmail) {
    throw new Error('Email already exists');
  }

  const existingUsername = users.find(u => u.username === userData.username);
  if (existingUsername) {
    throw new Error('Username already exists');
  }

  const newUser = new User(
    nextId++,
    userData.username,
    userData.email,
    userData.password,
    userData.firstName,
    userData.lastName,
    userData.active !== undefined ? userData.active : true
  );

  users.push(newUser);
  return newUser;
};

exports.updateUser = async (id, userData) => {
  const index = users.findIndex(u => u.id === id);
  if (index === -1) {
    throw new Error('User not found');
  }

  if (userData.email && userData.email !== users[index].email) {
    const existingEmail = users.find(u => u.email === userData.email);
    if (existingEmail) {
      throw new Error('Email already exists');
    }
  }

  if (userData.username && userData.username !== users[index].username) {
    const existingUsername = users.find(u => u.username === userData.username);
    if (existingUsername) {
      throw new Error('Username already exists');
    }
  }

  users[index] = { ...users[index], ...userData };
  return users[index];
};

exports.deleteUser = async (id) => {
  const index = users.findIndex(u => u.id === id);
  if (index === -1) {
    throw new Error('User not found');
  }
  users.splice(index, 1);
};

exports.activateUser = async (id) => {
  const index = users.findIndex(u => u.id === id);
  if (index === -1) {
    throw new Error('User not found');
  }
  users[index].active = true;
  return users[index];
};

exports.deactivateUser = async (id) => {
  const index = users.findIndex(u => u.id === id);
  if (index === -1) {
    throw new Error('User not found');
  }
  users[index].active = false;
  return users[index];
};
