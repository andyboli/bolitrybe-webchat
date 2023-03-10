const userController = require('./userController');

const faker = require('faker');

describe('User Controller', () => {
  describe('Create User', () => {
    it('on success', async () => {
      const mockUserModel = jest.fn();

      const mockDataSent = { ...faker.random.objectElement() };

      const mockDataReceived = {
        id: faker.random.number(),
        ...mockDataSent,
      };

      const mockDataTokenReceived = faker.random.hexaDecimal();

      const mockUser = jest.fn().mockReturnValue({
        create: jest
          .fn()
          .mockResolvedValue({ data: mockDataReceived, token: mockDataTokenReceived, error: null }),
      });

      const mockReq = { body: mockDataSent };

      const mockJson = jest.fn();

      const mockRes = { status: jest.fn().mockReturnValue({ json: mockJson }) };

      const act = userController.create({ User: mockUser, userModel: mockUserModel });

      await act(mockReq, mockRes);

      expect(mockUser).toHaveBeenCalledTimes(1);

      expect(mockUser).toHaveBeenCalledWith({ ...mockReq.body, userModel: mockUserModel });

      expect(mockRes.status).toHaveBeenCalledTimes(1);

      expect(mockRes.status).toHaveBeenCalledWith(201);

      expect(mockJson).toHaveBeenCalledTimes(1);

      expect(mockJson).toHaveBeenCalledWith({
        ...mockDataReceived,
        token: mockDataTokenReceived,
      });
    });

    it('on failure - email exists', async () => {
      const mockUserModel = jest.fn();

      const mockDataSent = { ...faker.random.objectElement() };

      const mockUser = jest.fn().mockReturnValue({
        create: jest.fn().mockResolvedValue({ data: null, token: null, error: 'existsEmail' }),
      });

      const mockReq = { body: mockDataSent };

      const mockRes = jest.fn();

      const act = userController.create({ User: mockUser, userModel: mockUserModel });

      try {
        await act(mockReq, mockRes);
      } catch (err) {
        const {
          output: {
            payload: { statusCode, message },
          },
        } = err;

        expect(statusCode).toBe(400);

        expect(message).toBe('Já existe um usuário com este email');
      } finally {
        expect(mockUser).toHaveBeenCalledTimes(1);

        expect(mockUser).toHaveBeenCalledWith({ ...mockReq.body, userModel: mockUserModel });

        expect(mockRes).toHaveBeenCalledTimes(0);
      }
    });

    it('on failure - nickname exists', async () => {
      const mockUserModel = jest.fn();

      const mockDataSent = { ...faker.random.objectElement() };

      const mockUser = jest.fn().mockReturnValueOnce({
        create: jest.fn().mockResolvedValue({ data: null, token: null, error: 'existsNickname' }),
      });

      const mockReq = { body: mockDataSent };

      const mockRes = jest.fn();

      const act = userController.create({ User: mockUser, userModel: mockUserModel });

      try {
        await act(mockReq, mockRes);
      } catch (err) {
        const {
          output: {
            payload: { statusCode, message },
          },
        } = err;

        expect(statusCode).toBe(400);

        expect(message).toBe('Já existe um usuário com este nickname');
      } finally {
        expect(mockUser).toHaveBeenCalledTimes(1);

        expect(mockUser).toHaveBeenCalledWith({ ...mockReq.body, userModel: mockUserModel });

        expect(mockRes).toHaveBeenCalledTimes(0);
      }
    });
  });

  describe('Find User', () => {
    it('on success', async () => {
      const mockUserModel = jest.fn();

      const mockDataSent = {
        id: faker.random.number(),
      };

      const mockDataReceived = {
        id: mockDataSent.id,
        ...faker.random.objectElement(),
      };

      const mockUser = jest.fn().mockReturnValue({
        find: jest.fn().mockResolvedValue({ data: mockDataReceived, error: null }),
      });

      const mockReq = { params: { id: mockDataSent.id } };

      const mockJson = jest.fn();

      const mockRes = { status: jest.fn().mockReturnValue({ json: mockJson }) };

      const act = userController.find({ User: mockUser, userModel: mockUserModel });

      await act(mockReq, mockRes);

      expect(mockUser).toHaveBeenCalledTimes(1);

      expect(mockUser).toHaveBeenCalledWith({ _id: mockDataSent.id, userModel: mockUserModel });

      expect(mockRes.status).toHaveBeenCalledTimes(1);

      expect(mockRes.status).toHaveBeenCalledWith(200);

      expect(mockJson).toHaveBeenCalledTimes(1);

      expect(mockJson).toHaveBeenCalledWith(mockDataReceived);
    });

    it('on failure - user not found', async () => {
      const mockUserModel = jest.fn();

      const mockDataSent = {
        id: faker.random.number(),
      };
      const mockUser = jest.fn().mockReturnValue({
        find: jest.fn().mockResolvedValue({ data: null, error: 'notFound' }),
      });

      const mockReq = { params: { id: mockDataSent.id } };

      const mockRes = jest.fn();

      const act = userController.find({ User: mockUser, userModel: mockUserModel });

      try {
        await act(mockReq, mockRes);
      } catch (err) {
        const {
          output: {
            payload: { statusCode, message },
          },
        } = err;

        expect(statusCode).toBe(400);

        expect(message).toBe('Usuário não encontrado');
      } finally {
        expect(mockUser).toHaveBeenCalledTimes(1);

        expect(mockUser).toHaveBeenCalledWith({ _id: mockDataSent.id, userModel: mockUserModel });

        expect(mockRes).toHaveBeenCalledTimes(0);
      }
    });
  });

  describe('List User', () => {
    it('on success', async () => {
      const mockUserModel = jest.fn();

      const createUser = () => ({
        id: faker.random.number(),
        email: faker.internet.email(),
        nickname: faker.name.findName(),
        password: faker.internet.password(),
      });

      const mockDataReceived = new Array(10).fill(undefined).map(createUser);

      const mockUser = jest.fn().mockReturnValue({
        list: jest.fn().mockResolvedValue(mockDataReceived),
      });

      const mockJson = jest.fn();

      const mockRes = { status: jest.fn().mockReturnValue({ json: mockJson }) };

      const act = userController.list({ User: mockUser, userModel: mockUserModel });

      await act(null, mockRes);

      expect(mockUser).toHaveBeenCalledTimes(1);

      expect(mockUser).toHaveBeenCalledWith({ userModel: mockUserModel });

      expect(mockRes.status).toHaveBeenCalledTimes(1);

      expect(mockRes.status).toHaveBeenCalledWith(200);

      expect(mockJson).toHaveBeenCalledTimes(1);

      expect(mockJson).toHaveBeenCalledWith(mockDataReceived);
    });
  });

  describe('Login User', () => {
    it('on success', async () => {
      const mockUserModel = jest.fn();

      const mockDataSent = {
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      const mockDataReceived = {
        id: faker.random.number(),
        email: mockDataSent.email,
        ...faker.random.objectElement(),
      };

      const mockDataTokenReceived = faker.random.hexaDecimal();

      const mockUser = jest.fn().mockReturnValue({
        login: jest
          .fn()
          .mockResolvedValue({ data: mockDataReceived, token: mockDataTokenReceived, error: null }),
      });

      const mockReq = { body: mockDataSent };

      const mockJson = jest.fn();

      const mockRes = { status: jest.fn().mockReturnValue({ json: mockJson }) };

      const act = userController.login({ User: mockUser, userModel: mockUserModel });

      await act(mockReq, mockRes);

      expect(mockUser).toHaveBeenCalledTimes(1);

      expect(mockUser).toHaveBeenCalledWith({ ...mockReq.body, userModel: mockUserModel });

      expect(mockRes.status).toHaveBeenCalledTimes(1);

      expect(mockRes.status).toHaveBeenCalledWith(200);

      expect(mockJson).toHaveBeenCalledTimes(1);

      expect(mockJson).toHaveBeenCalledWith({
        ...mockDataReceived,
        token: mockDataTokenReceived,
      });
    });

    it('on failure - user not found', async () => {
      const mockUserModel = jest.fn();

      const mockDataSent = {
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      const mockUser = jest.fn().mockReturnValue({
        login: jest.fn().mockResolvedValue({ data: null, token: null, error: 'notFound' }),
      });

      const mockReq = { body: mockDataSent };

      const mockRes = jest.fn();

      const act = userController.login({ User: mockUser, userModel: mockUserModel });

      try {
        await act(mockReq, mockRes);
      } catch (err) {
        const {
          output: {
            payload: { statusCode, message },
          },
        } = err;

        expect(statusCode).toBe(400);

        expect(message).toBe('Usuário não encontrado');
      } finally {
        expect(mockUser).toHaveBeenCalledTimes(1);

        expect(mockUser).toHaveBeenCalledWith({ ...mockReq.body, userModel: mockUserModel });

        expect(mockRes).toHaveBeenCalledTimes(0);
      }
    });

    it('on failure - wrong password', async () => {
      const mockUserModel = jest.fn();

      const mockDataSent = {
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      const mockUser = jest.fn().mockReturnValue({
        login: jest.fn().mockResolvedValue({ data: null, token: null, error: 'wrongPassword' }),
      });

      const mockReq = { body: mockDataSent };

      const mockRes = jest.fn();

      const act = userController.login({ User: mockUser, userModel: mockUserModel });

      try {
        await act(mockReq, mockRes);
      } catch (err) {
        const {
          output: {
            payload: { statusCode, message },
          },
        } = err;

        expect(statusCode).toBe(400);

        expect(message).toBe('Senha incorreta');
      } finally {
        expect(mockUser).toHaveBeenCalledTimes(1);

        expect(mockUser).toHaveBeenCalledWith({ ...mockReq.body, userModel: mockUserModel });

        expect(mockRes).toHaveBeenCalledTimes(0);
      }
    });
  });

  describe('Remove User', () => {
    it('on success', async () => {
      const mockUserModel = jest.fn();

      const mockId = faker.random.number();

      const mockUser = jest.fn().mockReturnValue({
        remove: jest.fn(),
      });

      const mockReq = { params: { id: mockId } };

      const mockEnd = jest.fn();

      const mockRes = { status: jest.fn().mockReturnValue({ end: mockEnd }) };

      const act = userController.remove({ User: mockUser, userModel: mockUserModel });

      await act(mockReq, mockRes);

      expect(mockUser).toHaveBeenCalledTimes(1);

      expect(mockUser).toHaveBeenCalledWith({ userModel: mockUserModel, _id: mockId });

      expect(mockRes.status).toHaveBeenCalledTimes(1);

      expect(mockRes.status).toHaveBeenCalledWith(204);

      expect(mockEnd).toHaveBeenCalledTimes(1);
    });
  });

  describe('Update User', () => {
    it('on success', async () => {
      const mockUserModel = jest.fn();

      const mockId = faker.random.number();

      const mockDataSent = {
        id: mockId,
        nickname: faker.name.findName(),
      };

      const mockDataReceived = {
        id: mockDataSent.id,
        nickname: faker.name.findName(),
        ...faker.random.objectElement(),
      };

      const mockUser = jest.fn().mockReturnValue({
        update: jest.fn().mockResolvedValue({ data: mockDataReceived, error: null }),
      });

      const mockEmit = jest.fn();

      const mockEvent = { emit: mockEmit };

      const mockReq = { params: { id: mockDataSent.id }, body: mockDataSent };

      const mockJson = jest.fn();

      const mockRes = { status: jest.fn().mockReturnValue({ json: mockJson }) };

      const act = userController.update({
        User: mockUser,
        userModel: mockUserModel,
        event: mockEvent,
      });

      await act(mockReq, mockRes);

      expect(mockUser).toHaveBeenCalledTimes(1);

      expect(mockUser).toHaveBeenCalledWith({
        _id: mockId,
        userModel: mockUserModel,
        ...mockReq.body,
      });

      expect(mockRes.status).toHaveBeenCalledTimes(1);

      expect(mockRes.status).toHaveBeenCalledWith(200);

      expect(mockJson).toHaveBeenCalledTimes(1);

      expect(mockJson).toHaveBeenCalledWith(mockDataReceived);

      expect(mockEmit).toHaveBeenCalledTimes(1);

      expect(mockEmit).toHaveBeenCalledWith('update');
    });

    it('on failure - user not found', async () => {
      const mockUserModel = jest.fn();

      const mockDataSent = {
        id: faker.random.number(),
        nickname: faker.name.findName(),
      };

      const mockUser = jest.fn().mockReturnValue({
        update: jest.fn().mockResolvedValue({ data: null, error: 'notFound' }),
      });

      const mockReq = { params: { id: mockDataSent.id }, body: mockDataSent };

      const mockRes = jest.fn();

      const act = userController.update({ User: mockUser, userModel: mockUserModel });

      try {
        await act(mockReq, mockRes);
      } catch (err) {
        const {
          output: {
            payload: { statusCode, message },
          },
        } = err;

        expect(statusCode).toBe(400);

        expect(message).toBe('Usuário não encontrado');
      } finally {
        expect(mockUser).toHaveBeenCalledTimes(1);

        expect(mockUser).toHaveBeenCalledWith({
          _id: mockDataSent.id,
          userModel: mockUserModel,
          ...mockReq.body,
        });

        expect(mockRes).toHaveBeenCalledTimes(0);
      }
    });
  });
});
