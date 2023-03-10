async function create({ data, Model }) {
  const messageModel = new Model(data);

  return messageModel.create();
}

async function listBy({ Model, field, data }) {
  const messageModel = new Model(data);

  const message = await messageModel.listBy(field);

  if (message.length === 0) return { data: null, error: 'notFound' };

  return { data: message, error: null };
}

module.exports = {
  create,
  listBy,
};
