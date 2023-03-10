const errorMiddleware = require('./error');
const faker = require('faker');

describe('Error Middleware', () => {
  it('Internal Server Error', () => {
    const mockMessage = faker.lorem.words;

    const mockErr = {
      isBoom: false,
      message: mockMessage,
    };

    const mockJson = jest.fn();

    const mockRes = { status: jest.fn().mockReturnValue({ json: mockJson }) };

    errorMiddleware(mockErr, null, mockRes, null);

    expect(mockRes.status).toHaveBeenCalledTimes(1);

    expect(mockRes.status).toHaveBeenCalledWith(500);

    expect(mockJson).toHaveBeenCalledTimes(1);

    expect(mockJson).toHaveBeenCalledWith({ error: { message: mockErr.message, details: null } });
  });

  it('Boom Error', () => {
    const mockMessage = faker.lorem.words();

    const mockStatusCode = faker.random.number();

    const mockErr = {
      isBoom: true,
      output: {
        payload: { statusCode: mockStatusCode, message: mockMessage },
      },
      data: null,
    };

    const mockJson = jest.fn();

    const mockRes = { status: jest.fn().mockReturnValue({ json: mockJson }) };

    errorMiddleware(mockErr, null, mockRes, null);

    expect(mockRes.status).toHaveBeenCalledTimes(1);

    expect(mockRes.status).toHaveBeenCalledWith(mockStatusCode);

    expect(mockJson).toHaveBeenCalledTimes(1);

    expect(mockJson).toHaveBeenCalledWith({ error: { message: mockMessage, details: null } });
  });

  it('Boom Error With Details', () => {
    const mockMessage = faker.lorem.words();

    const mockStatusCode = faker.random.number();

    const mockDetails = faker.random.objectElement();

    const mockErr = {
      isBoom: true,
      output: {
        payload: { statusCode: mockStatusCode, message: mockMessage },
      },
      data: mockDetails,
    };

    const mockJson = jest.fn();

    const mockRes = { status: jest.fn().mockReturnValue({ json: mockJson }) };

    errorMiddleware(mockErr, null, mockRes, null);

    expect(mockRes.status).toHaveBeenCalledTimes(1);

    expect(mockRes.status).toHaveBeenCalledWith(mockStatusCode);

    expect(mockJson).toHaveBeenCalledTimes(1);

    expect(mockJson).toHaveBeenCalledWith({
      error: { message: mockMessage, ...mockDetails },
    });
  });
});
