const Boom = require('@hapi/boom');

const service = require('../serviceController');

const handleError = {
  notFound: () => {
    throw Boom.badRequest('Chat não encontrado');
  },
};

function create({ Chat, chatModel, event }) {
  return async (req, res) => {
    const chat = new Chat({
      ...req.body,
      chatModel,
    });

    const data = await chat.create();

    if (!data.isPrivate) {
      event.emit('chat', { title: data.title, user: req.user.id, users: data.users });
    }

    res.status(201).json(data);
  };
}

function find({ Chat, chatModel }) {
  return service.find({
    Domain: Chat,
    model: chatModel,
    modelkey: 'chatModel',
    handleError,
    field: '_id',
  });
}

function listByUserId({ Chat, chatModel }) {
  return service.find({
    Domain: Chat,
    model: chatModel,
    modelkey: 'chatModel',
    handleError,
    field: 'userId',
  });
}

function listByUsers({ Chat, chatModel }) {
  return async (req, res) => {
    const chat = new Chat({ chatModel, ...req.body });

    const { data, error } = await chat.listByUsers();

    if (error) return handleError[error]();

    res.status(200).json(data);
  };
}

module.exports = {
  create,
  find,
  listByUserId,
  listByUsers,
};
