async function create({ data, Model }) {
  const { isPrivate, ...Data } = data;

  const chatModel = new Model({ ...Data, isPrivate: isPrivate || false });

  return chatModel.create();
}

async function find({ _id, Model }) {
  if (_id === 'bolichat') return { data: [{ title: 'bolichat', isPrivate: false }], error: null };

  const chatModel = new Model({ _id });

  const chat = await chatModel.find();

  if (!chat) return { data: null, error: 'notFound' };

  return { data: chat, error: null };
}

async function listByUserId({ data, Model }) {
  const chatModel = new Model(data);

  const chat = await chatModel.listByUserId();

  if (!chat) return { data: null, error: 'notFound' };

  return { data: chat, error: null };
}

async function listByUsers({ data, Model }) {
  const chatModel = new Model(data);

  const chat = await chatModel.listByUsers();

  if (!chat) return { data: null, error: 'notFound' };

  return { data: chat, error: null };
}

module.exports = {
  create,
  find,
  listByUserId,
  listByUsers,
};
