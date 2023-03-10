class UserRepository {
  constructor({ models, data }) {
    const { _id, ...Data } = data || {};

    this.Users = models.Users;
    this.Data = Data;
    this.id = _id;
  }

  async create() {
    return this.Users.create(this.Data);
  }

  async find() {
    return this.Users.find({ _id: this.id });
  }

  async findBy(field) {
    return this.Users.find({ [field]: this.Data[field] });
  }

  async list() {
    return this.Users.find({});
  }

  async remove() {
    return this.Users.deleteOne({ _id: this.id });
  }

  async update() {
    return this.Users.findOneAndUpdate({ _id: this.id }, this.Data, {
      new: true,
    });
  }
}

module.exports = UserRepository;
