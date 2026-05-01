/**
 * Models for TestMind API
 */

class User {
  constructor(id, username, email, password, firstName, lastName, active) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
    this.active = active !== undefined ? active : true;
  }
}

class CreateUserRequest {
  constructor(username, email, password, firstName, lastName) {
    this.username = username;
    this.email = email;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
  }
}

class UpdateUserRequest {
  constructor(username, email, firstName, lastName, active) {
    this.username = username;
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
    this.active = active;
  }
}

class ApiResponse {
  constructor(success, message, data) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.timestamp = new Date().toISOString();
  }

  static success(data) {
    return new ApiResponse(true, 'Operation successful', data);
  }

  static error(message) {
    return new ApiResponse(false, message, null);
  }
}

module.exports = {
  User,
  CreateUserRequest,
  UpdateUserRequest,
  ApiResponse
};
