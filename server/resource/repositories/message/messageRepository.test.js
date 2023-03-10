const MessageRepository = require('./messageRepository');

const faker = require('faker');

describe('Message Repository', () => {
  it('Create Message', async () => {
    const mockDataSent = { ...faker.random.objectElement() };

    const mockDataReceived = {
      _id: faker.random.number(),
      ...mockDataSent,
    };

    const mockCreate = jest.fn().mockResolvedValue(mockDataReceived);

    const mockModels = {
      Messages: {
        create: mockCreate,
      },
      Chats: {
        find: jest.fn().mockResolvedValue([]),
      },
    };

    const repository = new MessageRepository({ models: mockModels, data: mockDataSent });

    const data = await repository.create();

    expect(mockCreate).toHaveBeenCalledTimes(1);

    expect(mockCreate).toHaveBeenCalledWith(mockDataSent);

    expect(data).toStrictEqual({ ...mockDataReceived, chat: [] });
  });

  it('List Message By ChatId', async () => {
    const mockDataSent = {
      chatId: faker.random.number(),
    };

    const createMessage = () => ({
      id: faker.random.number(),
      createdAt: faker.date.recent(),
      content: faker.lorem.words(),
      userId: faker.random.number(),
      chatId: mockDataSent.chatId,
    });

    const mockDataMessagesReceived = new Array(10).fill(undefined).map(createMessage);

    const mockSort = jest.fn().mockResolvedValue(mockDataMessagesReceived);

    const mockFind = jest.fn().mockReturnValue({ sort: mockSort });

    const mockModels = {
      Messages: {
        find: mockFind,
      },
    };

    const repository = new MessageRepository({ models: mockModels, data: mockDataSent });

    const data = await repository.listBy('chatId');

    expect(mockFind).toHaveBeenCalledTimes(1);

    expect(mockFind).toHaveBeenCalledWith({ chatId: mockDataSent.chatId });

    expect(data).toStrictEqual(mockDataMessagesReceived);
  });
});
