const MessageService = require('./messageService');

const faker = require('faker');

describe('Message Service', () => {
  describe('Create Message', () => {
    it('on success', async () => {
      const mockDataSent = { ...faker.random.objectElement() };

      const mockDataReceived = {
        id: faker.random.number(),
        ...mockDataSent,
      };

      const mockModel = jest.fn().mockReturnValue({
        create: jest.fn().mockResolvedValue(mockDataReceived),
      });

      const data = await MessageService.create({ data: mockDataSent, Model: mockModel });

      expect(mockModel).toHaveBeenCalledTimes(1);

      expect(mockModel).toHaveBeenCalledWith(mockDataSent);

      expect(data).toStrictEqual(mockDataReceived);
    });
  });

  describe('List Message By ChatId', () => {
    it('on success', async () => {
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

      const mockListBy = jest.fn().mockReturnValue(mockDataMessagesReceived);

      const mockModel = jest.fn().mockReturnValue({
        listBy: mockListBy,
      });

      const data = await MessageService.listBy({ Model: mockModel, field: mockDataSent.chatId });

      expect(mockModel).toHaveBeenCalledTimes(1);

      expect(mockListBy).toHaveBeenCalledTimes(1);

      expect(mockListBy).toHaveBeenCalledWith(mockDataSent.chatId);

      expect(data).toStrictEqual({ data: mockDataMessagesReceived, error: null });
    });

    it('on failure', async () => {
      const mockDataSent = {
        chatId: faker.random.number(),
      };

      const mockListBy = jest.fn().mockReturnValue([]);

      const mockModel = jest.fn().mockReturnValue({
        listBy: mockListBy,
      });

      const data = await MessageService.listBy({ Model: mockModel, field: mockDataSent.chatId });

      expect(mockModel).toHaveBeenCalledTimes(1);

      expect(mockListBy).toHaveBeenCalledTimes(1);

      expect(mockListBy).toHaveBeenCalledWith(mockDataSent.chatId);

      expect(data).toStrictEqual({ data: null, error: 'notFound' });
    });
  });
});
