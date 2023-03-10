const userService = require('./userService');

const faker = require('faker');

const utils = require('../../utils');

afterEach(() => {
  jest.clearAllMocks();
});

describe('User Service', () => {
  describe('Create User', () => {
    it('on success', async () => {
      const mockDataUserSent = {
        email: faker.internet.email(),
        nickname: faker.name.findName(),
        password: faker.random.hexaDecimal(),
      };

      const mockUserWithoutPassord = {
        id: faker.random.number(),
        email: mockDataUserSent.email,
        nickname: mockDataUserSent.nickname,
      };

      const mockDataUserReceived = {
        ...mockUserWithoutPassord,
        password: mockDataUserSent.password,
      };

      const mockModel = jest.fn().mockReturnValue({
        findBy: jest.fn().mockResolvedValue([]),
        create: jest.fn().mockResolvedValue({ toObject: () => mockDataUserReceived }),
      });

      const mockHash = faker.random.hexaDecimal();

      const mockToken = faker.random.hexaDecimal();

      const mockCreateHash = jest.spyOn(utils.bcrypt, 'createHash').mockResolvedValue(mockHash);

      const mockSignToken = jest.spyOn(utils.jsonWebToken, 'signToken').mockReturnValue(mockToken);

      const data = await userService.create({ data: mockDataUserSent, Model: mockModel });

      expect(mockCreateHash).toHaveBeenCalledWith(mockDataUserSent.password);

      expect(mockModel).toHaveBeenCalledTimes(1);

      expect(mockModel).toHaveBeenCalledWith({ ...mockDataUserSent, password: mockHash });

      expect(mockSignToken).toHaveBeenCalledWith(mockUserWithoutPassord);

      expect(data).toStrictEqual({ data: mockUserWithoutPassord, token: mockToken, error: null });
    });

    it('on failure - email exists', async () => {
      const mockDataUserSent = {
        email: faker.internet.email(),
        nickname: faker.name.findName(),
        password: faker.internet.password(),
      };

      const mockModel = jest.fn().mockReturnValue({
        findBy: jest.fn().mockResolvedValue(['some-user']),
      });

      const mockHash = faker.random.hexaDecimal();

      const mockCreateHash = jest.spyOn(utils.bcrypt, 'createHash').mockResolvedValue(mockHash);

      const data = await userService.create({ data: mockDataUserSent, Model: mockModel });

      expect(mockCreateHash).toHaveBeenCalledWith(mockDataUserSent.password);

      expect(mockModel).toHaveBeenCalledTimes(1);

      expect(mockModel).toHaveBeenCalledWith({ ...mockDataUserSent, password: mockHash });

      expect(data).toStrictEqual({ data: null, token: null, error: 'existsEmail' });
    });

    it('on failure - nickname exists', async () => {
      const mockDataUserSent = {
        email: faker.internet.email(),
        nickname: faker.name.findName(),
        password: faker.internet.password(),
      };

      const mockModel = jest.fn().mockReturnValueOnce({
        findBy: jest.fn().mockResolvedValueOnce([]).mockResolvedValue(['some-user']),
      });

      const mockHash = faker.random.hexaDecimal();

      const mockCreateHash = jest.spyOn(utils.bcrypt, 'createHash').mockResolvedValue(mockHash);

      const data = await userService.create({ data: mockDataUserSent, Model: mockModel });

      expect(mockCreateHash).toHaveBeenCalledWith(mockDataUserSent.password);

      expect(mockModel).toHaveBeenCalledTimes(1);

      expect(mockModel).toHaveBeenCalledWith({ ...mockDataUserSent, password: mockHash });

      expect(data).toStrictEqual({ data: null, token: null, error: 'existsNickname' });
    });
  });

  describe('Find User', () => {
    it('on success', async () => {
      const mockId = faker.random.number();

      const mockDataUserSent = {
        email: faker.internet.email(),
        nickname: faker.name.findName(),
        password: faker.internet.password(),
      };

      const mockUserWithoutPassord = {
        id: faker.random.number(),
        email: mockDataUserSent.email,
        nickname: mockDataUserSent.nickname,
      };

      const mockDataUserReceived = {
        ...mockUserWithoutPassord,
        password: mockDataUserSent.password,
      };

      const mockModel = jest.fn().mockReturnValue({
        find: jest.fn().mockResolvedValue([{ toObject: () => mockDataUserReceived }]),
      });

      const data = await userService.find({ _id: mockId, Model: mockModel });

      expect(mockModel).toHaveBeenCalledTimes(1);

      expect(mockModel).toHaveBeenCalledWith({ _id: mockId });

      expect(data).toStrictEqual({
        data: mockUserWithoutPassord,
        error: null,
      });
    });

    it('on failure - user not found', async () => {
      const mockId = faker.random.number();

      const mockModel = jest.fn().mockReturnValue({
        find: jest.fn().mockResolvedValue(null),
      });

      const data = await userService.find({ _id: mockId, Model: mockModel });

      expect(mockModel).toHaveBeenCalledTimes(1);

      expect(mockModel).toHaveBeenCalledWith({ _id: mockId });

      expect(data).toStrictEqual({ data: null, error: 'notFound' });
    });
  });

  describe('List User', () => {
    it('on success', async () => {
      const createUser = () => ({
        id: faker.random.number(),
        email: faker.internet.email(),
        nickname: faker.name.findName(),
        image: faker.internet.url(),
        password: faker.internet.password(),
      });

      const mockDataUsersReceived = new Array(10).fill(undefined).map(createUser);

      const mockData = mockDataUsersReceived.map(
        ({ password, ...userWithoutPassword }) => userWithoutPassword,
      );

      const mockDataToObject = mockDataUsersReceived.map(
        ({ password, ...userWithoutPassword }) => ({ toObject: () => userWithoutPassword }),
      );

      const mockModel = jest.fn().mockReturnValue({
        list: jest.fn().mockResolvedValue(mockDataToObject),
      });

      const data = await userService.list({ Model: mockModel });

      expect(mockModel).toHaveBeenCalledTimes(1);

      expect(data).toStrictEqual(mockData);
    });
  });

  describe('Login User', () => {
    it('on success', async () => {
      const mockDataUserSent = {
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      const mockUserWithoutPassord = {
        id: faker.random.number(),
        email: mockDataUserSent.email,
        nickname: mockDataUserSent.nickname,
      };

      const mockPassword = faker.random.hexaDecimal();

      const mockDataUserReceived = {
        ...mockUserWithoutPassord,
        password: mockPassword,
      };

      const mockModel = jest.fn().mockReturnValue({
        findBy: jest.fn().mockResolvedValue([{ toObject: () => mockDataUserReceived }]),
      });

      const mockToken = faker.random.hexaDecimal();

      const mockCheckString = jest.spyOn(utils.bcrypt, 'checkString').mockResolvedValue(true);

      const mockSignToken = jest.spyOn(utils.jsonWebToken, 'signToken').mockReturnValue(mockToken);

      const data = await userService.login({ ...mockDataUserSent, Model: mockModel });

      expect(mockCheckString).toHaveBeenCalledWith({
        hash: mockPassword,
        string: mockDataUserSent.password,
      });

      expect(mockModel).toHaveBeenCalledTimes(1);

      expect(mockModel).toHaveBeenCalledWith(mockDataUserSent);

      expect(mockSignToken).toHaveBeenCalledWith(mockUserWithoutPassord);

      expect(data).toStrictEqual({ data: mockUserWithoutPassord, token: mockToken, error: null });
    });

    it('on failure - user not found', async () => {
      const mockDataUserSent = {
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      const mockModel = jest.fn().mockReturnValue({
        findBy: jest.fn().mockResolvedValue([]),
      });

      const data = await userService.login({ ...mockDataUserSent, Model: mockModel });

      expect(mockModel).toHaveBeenCalledTimes(1);

      expect(mockModel).toHaveBeenCalledWith(mockDataUserSent);

      expect(data).toStrictEqual({ data: null, token: null, error: 'notFound' });
    });

    it('on failure - wrong password', async () => {
      const mockDataUserSent = {
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      const mockUserWithoutPassord = {
        id: faker.random.number(),
        email: mockDataUserSent.email,
        nickname: mockDataUserSent.nickname,
      };

      const mockPassword = faker.random.hexaDecimal();

      const mockDataUserReceived = {
        ...mockUserWithoutPassord,
        password: mockPassword,
      };

      const mockModel = jest.fn().mockReturnValue({
        findBy: jest.fn().mockResolvedValue([{ toObject: () => mockDataUserReceived }]),
      });

      const mockCheckString = jest.spyOn(utils.bcrypt, 'checkString').mockResolvedValue(false);

      const data = await userService.login({ ...mockDataUserSent, Model: mockModel });

      expect(mockCheckString).toHaveBeenCalledWith({
        hash: mockPassword,
        string: mockDataUserSent.password,
      });

      expect(mockModel).toHaveBeenCalledTimes(1);

      expect(mockModel).toHaveBeenCalledWith(mockDataUserSent);

      expect(data).toStrictEqual({ data: null, token: null, error: 'wrongPassword' });
    });
  });

  describe('Remove User', () => {
    it('on success', async () => {
      const mockId = faker.random.number();

      const mockRemove = jest.fn();

      const mockModel = jest.fn().mockReturnValue({
        remove: mockRemove,
      });

      await userService.remove({ _id: mockId, Model: mockModel });

      expect(mockModel).toHaveBeenCalledTimes(1);

      expect(mockModel).toHaveBeenCalledWith({ _id: mockId });

      expect(mockRemove).toHaveBeenCalledTimes(1);
    });
  });

  describe('Update User', () => {
    it('on success', async () => {
      const mockId = faker.random.number();

      const mockDataUserSent = {
        nickname: faker.name.findName(),
      };

      const mockUserWithoutPassord = {
        id: mockId,
        email: faker.internet.email(),
        nickname: mockDataUserSent.nickname,
      };

      const mockDataUserReceived = {
        ...mockUserWithoutPassord,
        password: mockDataUserSent.password,
      };

      const mockUpdate = jest.fn().mockResolvedValueOnce({ toObject: () => mockDataUserReceived });

      const mockModel = jest.fn().mockReturnValue({
        find: jest.fn().mockResolvedValueOnce(true),
        findBy: jest.fn().mockResolvedValueOnce([]),
        update: mockUpdate,
      });

      const data = await userService.update({
        data: mockDataUserSent,
        _id: mockId,
        Model: mockModel,
      });

      expect(mockModel).toHaveBeenCalledTimes(1);

      expect(mockModel).toHaveBeenCalledWith({ _id: mockId, ...mockDataUserSent });

      expect(mockUpdate).toHaveBeenCalledTimes(1);

      expect(data).toStrictEqual({
        data: mockUserWithoutPassord,
        error: null,
      });
    });

    it('on failure - user not found', async () => {
      const mockId = faker.random.number();

      const mockDataUserSent = {
        nickname: faker.name.findName(),
      };

      const mockUpdate = jest.fn().mockResolvedValue();

      const mockModel = jest.fn().mockReturnValue({
        find: jest.fn().mockResolvedValueOnce([]),
        update: mockUpdate,
      });

      const data = await userService.update({
        data: mockDataUserSent,
        _id: mockId,
        Model: mockModel,
      });

      expect(mockModel).toHaveBeenCalledTimes(1);

      expect(mockModel).toHaveBeenCalledWith({ _id: mockId, ...mockDataUserSent });

      expect(mockUpdate).toHaveBeenCalledTimes(0);

      expect(data).toStrictEqual({
        data: null,
        error: 'notFound',
      });
    });

    it('on failure - nickname already exists', async () => {
      const mockId = faker.random.number();

      const mockDataUserSent = {
        nickname: faker.name.findName(),
      };

      const mockUpdate = jest.fn().mockResolvedValue();

      const mockModel = jest.fn().mockReturnValue({
        find: jest.fn().mockResolvedValueOnce(true),
        findBy: jest.fn().mockResolvedValueOnce(['user']),
        update: mockUpdate,
      });

      const data = await userService.update({
        data: mockDataUserSent,
        _id: mockId,
        Model: mockModel,
      });

      expect(mockModel).toHaveBeenCalledTimes(1);

      expect(mockModel).toHaveBeenCalledWith({ _id: mockId, ...mockDataUserSent });

      expect(mockUpdate).toHaveBeenCalledTimes(0);

      expect(data).toStrictEqual({
        data: null,
        error: 'existsNickname',
      });
    });
  });
});
