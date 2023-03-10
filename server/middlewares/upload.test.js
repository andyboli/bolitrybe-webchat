const Boom = require('@hapi/boom');

const multer = require('multer');

const util = require('util');

const faker = require('faker');

const uploadMiddleware = require('./upload');

jest.mock('@hapi/boom');

jest.mock('multer');

jest.mock('util');

afterEach(() => {
  jest.clearAllMocks();
});

describe('Upload Middleware', () => {
  it('on success', async () => {
    util.promisify.mockReturnValue(jest.fn());

    const mockSingle = jest.fn();

    const mockUpload = { single: mockSingle };

    multer.mockReturnValue(mockUpload);

    const mockDest = faker.lorem.word();

    const mockField = faker.lorem.word();

    const mockProtocol = faker.internet.protocol();

    const mockHost = faker.lorem.word();

    const mockFileName = faker.lorem.word();

    const mockReq = {
      body: {},
      headers: {},
      protocol: mockProtocol,
      get: jest.fn(() => mockHost),
      file: { originalname: mockFileName },
    };

    mockReq.headers['content-type'] = faker.lorem.word();

    const mockRes = jest.fn();

    const mockNext = jest.fn();

    const act = uploadMiddleware({ dest: mockDest, field: mockField });

    await act(mockReq, mockRes, mockNext);

    expect(multer.diskStorage).toHaveBeenCalledTimes(1);

    expect(mockSingle).toHaveBeenCalledWith(mockField);

    expect(mockReq.body.image).toStrictEqual(
      `${mockProtocol}://${mockHost}/${mockDest}/${mockFileName}`,
    );

    expect(mockNext).toHaveBeenCalledTimes(1);
  });

  it('on failure - file not received', async () => {
    Boom.badRequest.mockImplementation(jest.fn((message) => new Error(message)));

    const mockReq = {
      headers: {},
    };

    mockReq.headers['content-type'] = null;

    const mockDest = faker.lorem.word();

    const mockField = faker.lorem.word();

    const mockNext = jest.fn();

    const act = uploadMiddleware({ dest: mockDest, field: mockField });

    await act(mockReq, null, mockNext);

    expect(mockNext).toHaveBeenCalledTimes(1);

    expect(mockNext).toHaveBeenCalledWith(new Error('File not received'));
  });
});
