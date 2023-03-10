const userMapper = require('./userMapper');

const userRepository = require('./userRepository');

const models = require('../../database');

jest.mock('./userRepository');

test('User Mapper', () => {
  const mockDataSent = { a: 0 };

  const mockDataReceived = { b: 1 };

  userRepository.mockImplementation(jest.fn(() => mockDataReceived));

  const data = userMapper(mockDataSent);

  expect(userRepository).toHaveBeenCalledTimes(1);

  expect(userRepository).toHaveBeenCalledWith({ models, data: mockDataSent });

  expect(data).toStrictEqual(mockDataReceived);
});
