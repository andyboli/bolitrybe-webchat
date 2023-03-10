const messageController = require('./messageController');

const faker = require('faker');

describe('Message Controller', () => {
  describe('Create Message', () => {
    it('on success', async () => {
      const mockMessageModel = jest.fn();

      const mockDataSent = { ...faker.random.objectElement() };

      const mockDataReceived = {
        id: faker.random.number(),
        ...mockDataSent,
      };

      const mockMessage = jest.fn().mockReturnValue({
        create: jest.fn().mockResolvedValue(mockDataReceived),
      });

      const mockReq = {
        body: mockDataSent,
        user: { _id: faker.random.number(), nickname: faker.random.word() },
      };

      const mockJson = jest.fn();

      const mockRes = { status: jest.fn().mockReturnValue({ json: mockJson }) };

      const mockEvent = { emit: jest.fn() };

      const act = messageController.create({
        Message: mockMessage,
        messageModel: mockMessageModel,
        event: mockEvent,
      });

      await act(mockReq, mockRes);

      expect(mockMessage).toHaveBeenCalledTimes(1);

      expect(mockMessage).toHaveBeenCalledWith({
        ...mockReq.body,
        messageModel: mockMessageModel,
        userId: mockReq.user._id,
        nickname: mockReq.user.nickname,
      });

      expect(mockEvent.emit).toHaveBeenCalledTimes(1);

      expect(mockRes.status).toHaveBeenCalledTimes(1);

      expect(mockRes.status).toHaveBeenCalledWith(201);

      expect(mockJson).toHaveBeenCalledTimes(1);

      expect(mockJson).toHaveBeenCalledWith(mockDataReceived);
    });
  });

  describe('List Message By ChatId', () => {
    it('on success', async () => {
      const mockMessageModel = jest.fn();

      const mockChatId = faker.random.number();

      const createMessage = () => ({
        id: faker.random.number(),
        createdAt: faker.date.recent(),
        content: faker.lorem.words(),
        userId: faker.random.number(),
        chatId: mockChatId,
      });

      const mockDataReceived = new Array(10).fill(undefined).map(createMessage);

      const mockMessage = jest.fn().mockReturnValue({
        listBy: jest.fn().mockResolvedValue({ data: mockDataReceived, error: null }),
      });

      const mockJson = jest.fn();

      const mockReq = { query: { key: 'chatId', value: mockChatId } };

      const mockRes = { status: jest.fn().mockReturnValue({ json: mockJson }) };

      const act = messageController.listBy({
        Message: mockMessage,
        messageModel: mockMessageModel,
      });

      await act(mockReq, mockRes);

      expect(mockMessage).toHaveBeenCalledTimes(1);

      expect(mockMessage).toHaveBeenCalledWith({
        messageModel: mockMessageModel,
        chatId: mockChatId,
      });

      expect(mockRes.status).toHaveBeenCalledTimes(1);

      expect(mockRes.status).toHaveBeenCalledWith(200);

      expect(mockJson).toHaveBeenCalledTimes(1);

      expect(mockJson).toHaveBeenCalledWith(mockDataReceived);
    });

    it('on failure - message not found', async () => {
      const mockMessageModel = jest.fn();

      const mockMessage = jest.fn().mockReturnValue({
        listBy: jest.fn().mockResolvedValue({ data: null, error: 'notFound' }),
      });

      const mockRes = jest.fn();

      const mockChatId = faker.random.number();

      const mockReq = { query: { key: 'chatId', value: mockChatId } };

      const act = messageController.listBy({
        Message: mockMessage,
        messageModel: mockMessageModel,
      });

      try {
        await act(mockReq, mockRes);
      } catch (err) {
        const {
          output: {
            payload: { statusCode, message },
          },
        } = err;

        expect(statusCode).toBe(400);

        expect(message).toBe('Mensagem não encontrada');
      } finally {
        expect(mockMessage).toHaveBeenCalledTimes(1);

        expect(mockMessage).toHaveBeenCalledWith({
          messageModel: mockMessageModel,
          chatId: mockChatId,
        });

        expect(mockRes).toHaveBeenCalledTimes(0);
      }
    });
  });
});
