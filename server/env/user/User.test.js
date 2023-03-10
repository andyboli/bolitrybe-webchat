const userService = require('./userService');

const User = require('./User');

const faker = require('faker');

describe('User', () => {
  it('Create', async () => {
    const mockDataSent = { a: 0 };

    const mockDataReceived = { b: 1 };

    const mockId = faker.random.number();

    const mockModel = jest.fn();

    const mockCreate = jest.spyOn(userService, 'create').mockReturnValue(mockDataReceived);

    const user = new User({ userModel: mockModel, _id: mockId, ...mockDataSent });

    const data = await user.create();

    expect(mockCreate).toHaveBeenCalledTimes(1);

    expect(mockCreate).toHaveBeenCalledWith({ Model: mockModel, data: mockDataSent });

    expect(data).toStrictEqual(mockDataReceived);
  });

  it('Find', async () => {
    const mockDataSent = { a: 0 };

    const mockDataReceived = { b: 1 };

    const mockId = faker.random.number();

    const mockModel = jest.fn();

    const mockFind = jest.spyOn(userService, 'find').mockReturnValue(mockDataReceived);

    const user = new User({ userModel: mockModel, _id: mockId, ...mockDataSent });

    const data = await user.find();

    expect(mockFind).toHaveBeenCalledTimes(1);

    expect(mockFind).toHaveBeenCalledWith({ Model: mockModel, _id: mockId });

    expect(data).toStrictEqual(mockDataReceived);
  });

  it('List', async () => {
    const mockDataSent = { a: 0 };

    const mockDataReceived = { b: 1 };

    const mockModel = jest.fn();

    const mockList = jest.spyOn(userService, 'list').mockReturnValue(mockDataReceived);

    const user = new User({ userModel: mockModel, ...mockDataSent });

    const data = await user.list();

    expect(mockList).toHaveBeenCalledTimes(1);

    expect(mockList).toHaveBeenCalledWith({ Model: mockModel });

    expect(data).toStrictEqual(mockDataReceived);
  });

  it('Login', async () => {
    const mockDataSent = { email: faker.internet.email(), password: faker.internet.password() };

    const mockDataReceived = { b: 1 };

    const mockModel = jest.fn();

    const mockLogin = jest.spyOn(userService, 'login').mockReturnValue(mockDataReceived);

    const user = new User({ userModel: mockModel, ...mockDataSent });

    const data = await user.login();

    expect(mockLogin).toHaveBeenCalledTimes(1);

    expect(mockLogin).toHaveBeenCalledWith({ Model: mockModel, ...mockDataSent });

    expect(data).toStrictEqual(mockDataReceived);
  });

  it('Remove', async () => {
    const mockId = faker.random.number();

    const mockModel = jest.fn();

    const mockRemove = jest.spyOn(userService, 'remove').mockImplementation(jest.fn());

    const user = new User({ userModel: mockModel, _id: mockId });

    await user.remove();

    expect(mockRemove).toHaveBeenCalledTimes(1);

    expect(mockRemove).toHaveBeenCalledWith({ Model: mockModel, _id: mockId });
  });

  it('Update', async () => {
    const mockDataSent = { email: faker.internet.email(), password: faker.internet.password() };

    const mockId = faker.random.number();

    const mockModel = jest.fn();

    const mockUpdate = jest.spyOn(userService, 'update').mockImplementation(jest.fn());

    const user = new User({ userModel: mockModel, _id: mockId, ...mockDataSent });

    await user.update();

    expect(mockUpdate).toHaveBeenCalledTimes(1);

    expect(mockUpdate).toHaveBeenCalledWith({ Model: mockModel, _id: mockId, data: mockDataSent });
  });
});
