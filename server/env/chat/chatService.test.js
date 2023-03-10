const chatService = require('./chatService');

const faker = require('faker');

describe('Chat Service', () => {
  describe('Create Chat', () => {
    it('on success', async () => {
      const mockDataSent = { ...faker.random.objectElement(), isPrivate: false };

      const mockDataReceived = {
        id: faker.random.number(),
        ...mockDataSent,
      };

      const mockModel = jest.fn().mockReturnValue({
        create: jest.fn().mockResolvedValue(mockDataReceived),
      });

      const data = await chatService.create({ data: mockDataSent, Model: mockModel });

      expect(mockModel).toHaveBeenCalledTimes(1);

      expect(mockModel).toHaveBeenCalledWith(mockDataSent);

      expect(data).toStrictEqual({ ...mockDataReceived });
    });
  });

  describe('Find Chat', () => {
    it('on success', async () => {
      const mockId = faker.random.number();

      const mockDataSent = {
        id: faker.random.number(),
      };

      const mockDataUserReceived = {
        ...mockDataSent,
        ...faker.random.objectElement(),
      };

      const mockModel = jest.fn().mockReturnValue({
        find: jest.fn().mockResolvedValue(mockDataUserReceived),
      });

      const data = await chatService.find({ _id: mockId, Model: mockModel });

      expect(mockModel).toHaveBeenCalledTimes(1);

      expect(mockModel).toHaveBeenCalledWith({ _id: mockId });

      expect(data).toStrictEqual({
        data: mockDataUserReceived,
        error: null,
      });
    });

    it('on failure - user not found', async () => {
      const mockId = faker.random.number();

      const mockModel = jest.fn().mockReturnValue({
        find: jest.fn().mockResolvedValue(null),
      });

      const data = await chatService.find({ _id: mockId, Model: mockModel });

      expect(mockModel).toHaveBeenCalledTimes(1);

      expect(mockModel).toHaveBeenCalledWith({ _id: mockId });

      expect(data).toStrictEqual({ data: null, error: 'notFound' });
    });
  });

  describe('List Chat By UserId', () => {
    it('on success', async () => {
      const mockDataSent = {
        userId: faker.random.number(),
      };

      const createChat = () => ({
        id: faker.random.number(),
        createdAt: faker.date.recent(),
        title: faker.lorem.words(),
        users: new Array(10).fill(undefined).map(() => faker.random.word),
        userId: mockDataSent.userId,
      });

      const mockDataChatsReceived = new Array(10).fill(undefined).map(createChat);

      const mockListByUserId = jest.fn().mockReturnValue(mockDataChatsReceived);

      const mockModel = jest.fn().mockReturnValue({
        listByUserId: mockListByUserId,
      });

      const data = await chatService.listByUserId({ Model: mockModel, data: mockDataSent });

      expect(mockModel).toHaveBeenCalledTimes(1);

      expect(mockListByUserId).toHaveBeenCalledTimes(1);

      expect(data).toStrictEqual({ data: mockDataChatsReceived, error: null });
    });

    it('on failure', async () => {
      const mockDataSent = {
        userId: faker.random.number(),
      };

      const mockListByUserId = jest.fn().mockReturnValue(null);

      const mockModel = jest.fn().mockReturnValue({
        listByUserId: mockListByUserId,
      });

      const data = await chatService.listByUserId({ Model: mockModel, field: mockDataSent.userId });

      expect(mockModel).toHaveBeenCalledTimes(1);

      expect(mockListByUserId).toHaveBeenCalledTimes(1);

      expect(data).toStrictEqual({ data: null, error: 'notFound' });
    });
  });

  describe('List Chat By Users', () => {
    it('on success', async () => {
      const mockDataSent = {
        userId: faker.random.number(),
      };

      const createChat = () => ({
        id: faker.random.number(),
        createdAt: faker.date.recent(),
        title: faker.lorem.words(),
        users: new Array(10).fill(undefined).map(() => faker.random.word),
        userId: mockDataSent.userId,
      });

      const mockDataChatsReceived = new Array(10).fill(undefined).map(createChat);

      const mockListByUsers = jest.fn().mockReturnValue(mockDataChatsReceived);

      const mockModel = jest.fn().mockReturnValue({
        listByUsers: mockListByUsers,
      });

      const data = await chatService.listByUsers({ Model: mockModel, field: mockDataSent.chatId });

      expect(mockModel).toHaveBeenCalledTimes(1);

      expect(mockListByUsers).toHaveBeenCalledTimes(1);

      expect(data).toStrictEqual({ data: mockDataChatsReceived, error: null });
    });

    it('on failure', async () => {
      const mockDataSent = {
        userId: faker.random.number(),
      };

      const mockListByUsers = jest.fn().mockReturnValue(null);

      const mockModel = jest.fn().mockReturnValue({
        listByUsers: mockListByUsers,
      });

      const data = await chatService.listByUsers({ Model: mockModel, field: mockDataSent.userId });

      expect(mockModel).toHaveBeenCalledTimes(1);

      expect(mockListByUsers).toHaveBeenCalledTimes(1);

      expect(data).toStrictEqual({ data: null, error: 'notFound' });
    });
  });
});
