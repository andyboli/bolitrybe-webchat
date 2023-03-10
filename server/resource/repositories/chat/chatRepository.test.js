const ChatRepository = require('./chatRepository');

const faker = require('faker');

describe('Chat Repository', () => {
  it('Create Chat', async () => {
    const mockDataSent = { ...faker.random.objectElement() };

    const mockDataReceived = {
      _id: faker.random.number(),
      ...mockDataSent,
    };

    const mockCreate = jest.fn().mockResolvedValue(mockDataReceived);

    const mockModels = {
      Chats: {
        create: mockCreate,
      },
    };

    const repository = new ChatRepository({ models: mockModels, data: mockDataSent });

    const data = await repository.create();

    expect(mockCreate).toHaveBeenCalledTimes(1);

    expect(mockCreate).toHaveBeenCalledWith(mockDataSent);

    expect(data).toStrictEqual(mockDataReceived);
  });

  it('Find Chat', async () => {
    const mockDataSent = {
      _id: faker.random.number(),
    };

    const mockDataReceived = {
      _id: mockDataSent._id,
      ...faker.random.objectElement(),
    };

    const mockFind = jest.fn().mockResolvedValue(mockDataReceived);

    const mockModels = {
      Chats: {
        find: mockFind,
      },
    };

    const repository = new ChatRepository({ models: mockModels, data: mockDataSent });

    const data = await repository.find();

    expect(mockFind).toHaveBeenCalledTimes(1);

    expect(mockFind).toHaveBeenCalledWith({ _id: mockDataSent._id });

    expect(data).toStrictEqual(mockDataReceived);
  });

  it('List Chat By UserId', async () => {
    const mockDataSent = {
      userId: faker.random.number(),
    };

    const createChat = () => ({
      _id: faker.random.number(),
      createdAt: faker.date.recent(),
      title: faker.lorem.words(),
      users: new Array(10).fill(undefined).map(() => faker.random.word),
      userId: mockDataSent.userId,
    });

    const mockDataChatsReceived = new Array(10).fill(undefined).map(createChat);

    const mockSort = jest.fn().mockResolvedValue(mockDataChatsReceived);

    const mockFind = jest.fn().mockReturnValue({ sort: mockSort });

    const mockModels = {
      Chats: {
        find: mockFind,
      },
    };

    const repository = new ChatRepository({ models: mockModels, data: mockDataSent });

    const data = await repository.listByUserId();

    expect(mockFind).toHaveBeenCalledTimes(1);

    expect(mockFind).toHaveBeenCalledWith({ userId: mockDataSent.userId });

    expect(data).toStrictEqual(mockDataChatsReceived);
  });

  it('List Chat By Users', async () => {
    const mockUserA = faker.random.number();

    const mockUserB = faker.random.number();

    const mockDataSent = {
      users: [mockUserA, mockUserB],
    };

    const createChat = () => ({
      _id: faker.random.number(),
      createdAt: faker.date.recent(),
      title: faker.lorem.words(),
      users: mockDataSent.users,
      userId: faker.random.number(),
    });

    const mockDataChatsReceived = new Array(10).fill(undefined).map(createChat);

    const mockSort = jest.fn().mockResolvedValue(mockDataChatsReceived);

    const mockFind = jest.fn().mockReturnValue({ sort: mockSort });

    const mockModels = {
      Chats: {
        find: mockFind,
      },
    };

    const repository = new ChatRepository({ models: mockModels, data: mockDataSent });

    const data = await repository.listByUsers();

    expect(mockFind).toHaveBeenCalledTimes(1);

    expect(mockFind).toHaveBeenCalledWith({ users: { $all: mockDataSent.users } });

    expect(data).toStrictEqual(mockDataChatsReceived);
  });
});
