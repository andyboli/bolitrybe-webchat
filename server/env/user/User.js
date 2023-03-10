const userService = require('./userService');

class User {
  constructor({ userModel, _id, ...data }) {
    this.userModel = userModel;
    this.data = data;
    this.id = _id;
  }

  async create() {
    return userService.create({ data: this.data, Model: this.userModel });
  }

  async find() {
    return userService.find({ _id: this.id, Model: this.userModel });
  }

  async list() {
    return userService.list({ Model: this.userModel });
  }

  async login() {
    return userService.login({
      email: this.data.email,
      password: this.data.password,
      Model: this.userModel,
    });
  }

  async remove() {
    return userService.remove({ _id: this.id, Model: this.userModel });
  }

  async update() {
    return userService.update({ data: this.data, _id: this.id, Model: this.userModel });
  }
}

module.exports = User;
