const chatController = require('./chatController');

const faker = require('faker');

describe('Chat Controller', () => {
  describe('Create Chat', () => {
    it('on success', async () => {
      const mockChatModel = jest.fn();

      const mockDataSent = { ...faker.random.objectElement() };

      const mockDataReceived = {
        _id: faker.random.number(),
        ...mockDataSent,
      };

      const mockEmit = jest.fn();

      const mockEvent = { emit: mockEmit };

      const mockChat = jest.fn().mockReturnValue({
        create: jest.fn().mockResolvedValue(mockDataReceived),
      });

      const mockReq = { body: mockDataSent, user: faker.random.number() };

      const mockJson = jest.fn();

      const mockRes = { status: jest.fn().mockReturnValue({ json: mockJson }) };

      const act = chatController.create({
        Chat: mockChat,
        chatModel: mockChatModel,
        event: mockEvent,
      });

      await act(mockReq, mockRes);

      expect(mockChat).toHaveBeenCalledTimes(1);

      expect(mockChat).toHaveBeenCalledWith({ ...mockReq.body, chatModel: mockChatModel });

      expect(mockRes.status).toHaveBeenCalledTimes(1);

      expect(mockRes.status).toHaveBeenCalledWith(201);

      expect(mockJson).toHaveBeenCalledTimes(1);

      expect(mockJson).toHaveBeenCalledWith(mockDataReceived);
    });
  });

  describe('Find Chat', () => {
    it('on success', async () => {
      const mockChatModel = jest.fn();

      const mockChatId = faker.random.number();

      const createChat = () => ({
        id: faker.random.number(),
        createdAt: faker.date.recent(),
        content: faker.lorem.words(),
        userId: faker.random.number(),
        chatId: mockChatId,
      });

      const mockDataReceived = new Array(10).fill(undefined).map(createChat);

      const mockChat = jest.fn().mockReturnValue({
        find: jest.fn().mockResolvedValue({ data: mockDataReceived, error: null }),
      });

      const mockJson = jest.fn();

      const mockReq = { params: { id: mockChatId } };

      const mockRes = { status: jest.fn().mockReturnValue({ json: mockJson }) };

      const act = chatController.find({
        Chat: mockChat,
        chatModel: mockChatModel,
      });

      await act(mockReq, mockRes);

      expect(mockChat).toHaveBeenCalledTimes(1);

      expect(mockChat).toHaveBeenCalledWith({
        chatModel: mockChatModel,
        _id: mockChatId,
      });

      expect(mockRes.status).toHaveBeenCalledTimes(1);

      expect(mockRes.status).toHaveBeenCalledWith(200);

      expect(mockJson).toHaveBeenCalledTimes(1);

      expect(mockJson).toHaveBeenCalledWith(mockDataReceived);
    });

    it('on failure - Chat not found', async () => {
      const mockChatModel = jest.fn();

      const mockChat = jest.fn().mockReturnValue({
        find: jest.fn().mockResolvedValue({ data: null, error: 'notFound' }),
      });

      const mockRes = jest.fn();

      const mockChatId = faker.random.number();

      const mockReq = { params: { id: mockChatId } };

      const act = chatController.find({
        Chat: mockChat,
        chatModel: mockChatModel,
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

        expect(message).toBe('Chat não encontrado');
      } finally {
        expect(mockChat).toHaveBeenCalledTimes(1);

        expect(mockChat).toHaveBeenCalledWith({
          chatModel: mockChatModel,
          _id: mockChatId,
        });

        expect(mockRes).toHaveBeenCalledTimes(0);
      }
    });
  });

  describe('List Chat By UserId', () => {
    it('on success', async () => {
      const mockChatModel = jest.fn();

      const mockUserId = faker.random.number();

      const createChat = () => ({
        _id: faker.random.number(),
        createdAt: faker.date.recent(),
        userId: mockUserId,
      });

      const mockDataReceived = new Array(10).fill(undefined).map(createChat);

      const mockChat = jest.fn().mockReturnValue({
        listByUserId: jest.fn().mockResolvedValue({ data: mockDataReceived, error: null }),
      });

      const mockJson = jest.fn();

      const mockReq = { params: { id: mockUserId } };

      const mockRes = { status: jest.fn().mockReturnValue({ json: mockJson }) };

      const act = chatController.listByUserId({
        Chat: mockChat,
        chatModel: mockChatModel,
      });

      await act(mockReq, mockRes);

      expect(mockChat).toHaveBeenCalledTimes(1);

      expect(mockChat).toHaveBeenCalledWith({
        chatModel: mockChatModel,
        userId: mockUserId,
      });

      expect(mockRes.status).toHaveBeenCalledTimes(1);

      expect(mockRes.status).toHaveBeenCalledWith(200);

      expect(mockJson).toHaveBeenCalledTimes(1);

      expect(mockJson).toHaveBeenCalledWith(mockDataReceived);
    });

    it('on failure - Chat not found', async () => {
      const mockChatModel = jest.fn();

      const mockChat = jest.fn().mockReturnValue({
        listByUserId: jest.fn().mockResolvedValue({ data: null, error: 'notFound' }),
      });

      const mockRes = jest.fn();

      const mockUserId = faker.random.number();

      const mockReq = { params: { id: mockUserId } };

      const act = chatController.listByUserId({
        Chat: mockChat,
        chatModel: mockChatModel,
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

        expect(message).toBe('Chat não encontrado');
      } finally {
        expect(mockChat).toHaveBeenCalledTimes(1);

        expect(mockChat).toHaveBeenCalledWith({
          chatModel: mockChatModel,
          userId: mockUserId,
        });

        expect(mockRes).toHaveBeenCalledTimes(0);
      }
    });
  });

  describe('List Chat By Users', () => {
    it('on success', async () => {
      const mockChatModel = jest.fn();

      const mockUserA = faker.random.number();

      const mockUserB = faker.random.number();

      const createChat = () => ({
        id: faker.random.number(),
        createdAt: faker.date.recent(),
        content: faker.lorem.words(),
        userId: faker.random.number(),
        users: [mockUserA, mockUserB],
      });

      const mockDataReceived = new Array(10).fill(undefined).map(createChat);

      const mockChat = jest.fn().mockReturnValue({
        listByUsers: jest.fn().mockResolvedValue({ data: mockDataReceived, error: null }),
      });

      const mockJson = jest.fn();

      const mockReq = { body: { users: [mockUserA, mockUserB] } };

      const mockRes = { status: jest.fn().mockReturnValue({ json: mockJson }) };

      const act = chatController.listByUsers({
        Chat: mockChat,
        chatModel: mockChatModel,
      });

      await act(mockReq, mockRes);

      expect(mockChat).toHaveBeenCalledTimes(1);

      expect(mockChat).toHaveBeenCalledWith({
        chatModel: mockChatModel,
        ...mockReq.body,
      });

      expect(mockRes.status).toHaveBeenCalledTimes(1);

      expect(mockRes.status).toHaveBeenCalledWith(200);

      expect(mockJson).toHaveBeenCalledTimes(1);

      expect(mockJson).toHaveBeenCalledWith(mockDataReceived);
    });

    it('on failure - Chat not found', async () => {
      const mockChatModel = jest.fn();

      const mockUserA = faker.random.number();

      const mockUserB = faker.random.number();

      const mockChat = jest.fn().mockReturnValue({
        listByUsers: jest.fn().mockResolvedValue({ data: null, error: 'notFound' }),
      });

      const mockRes = jest.fn();

      const mockChatId = faker.random.number();

      const mockReq = { body: { users: [mockUserA, mockUserB] } };

      const act = chatController.listByUsers({
        Chat: mockChat,
        chatModel: mockChatModel,
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

        expect(message).toBe('Chat não encontrado');
      } finally {
        expect(mockChat).toHaveBeenCalledTimes(1);

        expect(mockChat).toHaveBeenCalledWith({
          chatModel: mockChatModel,
          users: [mockUserA, mockUserB],
        });

        expect(mockRes).toHaveBeenCalledTimes(0);
      }
    });
  });
});
