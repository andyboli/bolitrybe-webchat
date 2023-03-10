const Boom = require('@hapi/boom');

const utils = require('../utils');

const models = require('../resource');

const faker = require('faker');

const authMiddleware = require('./auth');

jest.mock('../resource');

jest.mock('@hapi/boom');

afterEach(() => {
  jest.clearAllMocks();
});

describe('Auth Middleware', () => {
  it('on success', async () => {
    const mockToken = faker.random.hexaDecimal();

    const mockNext = jest.fn();

    const mockDataUserSent = {
      email: faker.internet.email(),
      displayName: faker.name.findName(),
      password: faker.internet.password(),
    };

    const mockDataUserReceived = [
      {
        dataValues: {
          email: faker.internet.email(),
          displayName: faker.name.findName(),
          password: faker.internet.password(),
          password: mockDataUserSent.password,
        },
      },
    ];

    const mockReq = {
      headers: {
        authorization: mockToken,
      },
    };

    const mockModel = jest.spyOn(models, 'userModel').mockReturnValue({
      findBy: jest.fn().mockResolvedValue(mockDataUserReceived),
    });

    const mockEmail = faker.internet.email();

    const mockVerifyToken = jest
      .spyOn(utils.jsonWebToken, 'verifyToken')
      .mockReturnValue({ data: { email: mockEmail } });

    await authMiddleware(mockReq, null, mockNext);

    expect(mockVerifyToken).toHaveBeenCalledTimes(1);

    expect(mockVerifyToken).toHaveBeenCalledWith(mockToken);

    expect(mockModel).toHaveBeenCalledTimes(1);

    expect(mockModel).toHaveBeenCalledWith({ email: mockEmail });

    expect(mockReq.user).toStrictEqual(mockDataUserReceived[0].dataValues);

    expect(mockNext).toHaveBeenCalledTimes(1);
  });

  it('on failure - token not found', async () => {
    Boom.unauthorized.mockImplementation(jest.fn((message) => new Error(message)));

    const mockReq = {
      headers: {
        authorization: null,
      },
    };

    const mockNext = jest.fn();

    await authMiddleware(mockReq, null, mockNext);

    expect(mockNext).toHaveBeenCalledTimes(1);

    expect(mockNext).toHaveBeenCalledWith(new Error('Token not found'));
  });

  it('on failure - user not found', async () => {
    Boom.unauthorized.mockImplementation(jest.fn((message) => new Error(message)));

    const mockToken = faker.random.hexaDecimal();

    const mockNext = jest.fn();

    const mockReq = {
      headers: {
        authorization: mockToken,
      },
    };

    const mockEmail = faker.internet.email();

    const mockModel = jest.spyOn(models, 'userModel').mockReturnValue({
      findBy: jest.fn().mockResolvedValue([]),
    });

    const mockVerifyToken = jest
      .spyOn(utils.jsonWebToken, 'verifyToken')
      .mockReturnValue({ data: { email: mockEmail } });

    await authMiddleware(mockReq, null, mockNext);

    expect(mockVerifyToken).toHaveBeenCalledTimes(1);

    expect(mockVerifyToken).toHaveBeenCalledWith(mockToken);

    expect(mockModel).toHaveBeenCalledTimes(1);

    expect(mockModel).toHaveBeenCalledWith({ email: mockEmail });

    expect(mockNext).toHaveBeenCalledTimes(1);

    expect(mockNext).toHaveBeenCalledWith(new Error('Error by looking a user with this token'));
  });
});
