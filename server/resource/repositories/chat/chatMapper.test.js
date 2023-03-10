const chatMapper = require('./chatMapper');

const chatRepository = require('./chatRepository');

const models = require('../../database');

jest.mock('./chatRepository');

test('Chat Mapper', () => {
  const mockDataSent = { a: 0 };

  const mockDataReceived = { b: 1 };

  chatRepository.mockImplementation(jest.fn(() => mockDataReceived));

  const data = chatMapper(mockDataSent);

  expect(chatRepository).toHaveBeenCalledTimes(1);

  expect(chatRepository).toHaveBeenCalledWith({ models, data: mockDataSent });

  expect(data).toStrictEqual(mockDataReceived);
});
