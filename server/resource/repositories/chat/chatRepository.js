class ChatRepository {
  constructor({ models, data }) {
    const { _id, ...Data } = data || {};

    this.Chats = models.Chats;
    this.Data = Data;
    this.id = _id;
  }

  async create() {
    return this.Chats.create(this.Data);
  }

  async find() {
    return this.Chats.find({ _id: this.id });
  }

  async listByUserId() {
    return this.Chats.find({ userId: this.Data.userId }).sort({
      createdAt: 'asc',
    });
  }

  async listByUsers() {
    return this.Chats.find({
      users: { $all: this.Data.users },
    }).sort({
      createdAt: 'asc',
    });
  }
}

module.exports = ChatRepository;
