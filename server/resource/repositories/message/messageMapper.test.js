const messageMapper = require('./messageMapper');

const messageRepository = require('./messageRepository');

const models = require('../../database');

jest.mock('./messageRepository');

test('Message Mapper', () => {
  const mockDataSent = { a: 0 };

  const mockDataReceived = { b: 1 };

  messageRepository.mockImplementation(jest.fn(() => mockDataReceived));

  const data = messageMapper(mockDataSent);

  expect(messageRepository).toHaveBeenCalledTimes(1);

  expect(messageRepository).toHaveBeenCalledWith({ models, data: mockDataSent });

  expect(data).toStrictEqual(mockDataReceived);
});
