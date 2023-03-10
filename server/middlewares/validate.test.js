const Boom = require('@hapi/boom');

const faker = require('faker');

const validateMiddleware = require('./validate');

jest.mock('@hapi/boom');

afterEach(() => {
  jest.clearAllMocks();
});

describe('Validate Middleware', () => {
  it('on success', async () => {
    const mockReq = { body: faker.random.objectElement };

    const mockNext = jest.fn();

    const mockSchema = {
      validate: jest.fn().mockReturnValue({ error: null }),
    };

    const act = validateMiddleware(mockSchema);

    await act(mockReq, null, mockNext);

    expect(mockNext).toHaveBeenCalledTimes(1);
  });

  it('on failure - invalid data', async () => {
    Boom.badRequest.mockImplementation(jest.fn((message) => new Error(message)));

    const mockReq = { body: faker.random.objectElement };

    const mockNext = jest.fn();

    const mockError = { details: ['some-details'] };

    const mockSchema = {
      validate: jest.fn().mockReturnValue({ error: mockError }),
    };

    const act = validateMiddleware(mockSchema);

    await act(mockReq, null, mockNext);

    expect(mockNext).toHaveBeenCalledTimes(1);

    expect(mockNext).toHaveBeenCalledWith(new Error('Invalid Data'));
  });
});
