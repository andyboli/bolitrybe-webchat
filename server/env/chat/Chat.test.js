const chatService = require('./chatService');

const Chat = require('./Chat');

const faker = require('faker');

describe('Chat', () => {
  it('Create', async () => {
    const mockDataSent = { a: 0 };

    const mockDataReceived = { b: 1 };

    const mockId = faker.random.number();

    const mockModel = jest.fn();

    const mockCreate = jest.spyOn(chatService, 'create').mockReturnValue(mockDataReceived);

    const chat = new Chat({ chatModel: mockModel, _id: mockId, ...mockDataSent });

    const data = await chat.create();

    expect(mockCreate).toHaveBeenCalledTimes(1);

    expect(mockCreate).toHaveBeenCalledWith({ Model: mockModel, data: mockDataSent });

    expect(data).toStrictEqual(mockDataReceived);
  });

  it('Find', async () => {
    const mockDataReceived = { b: 1 };

    const mockId = faker.random.number();

    const mockModel = jest.fn();

    const mockFind = jest.spyOn(chatService, 'find').mockReturnValue(mockDataReceived);

    const chat = new Chat({ chatModel: mockModel, _id: mockId });

    const data = await chat.find();

    expect(mockFind).toHaveBeenCalledTimes(1);

    expect(mockFind).toHaveBeenCalledWith({ Model: mockModel, _id: mockId });

    expect(data).toStrictEqual(mockDataReceived);
  });

  it('listByUserId', async () => {
    const mockDataSent = { a: 0 };

    const mockDataReceived = { b: 1 };

    const mockModel = jest.fn();

    const mockList = jest.spyOn(chatService, 'listByUserId').mockReturnValue(mockDataReceived);

    const chat = new Chat({ chatModel: mockModel, ...mockDataSent });

    const data = await chat.listByUserId();

    expect(mockList).toHaveBeenCalledTimes(1);

    expect(mockList).toHaveBeenCalledWith({ data: mockDataSent, Model: mockModel });

    expect(data).toStrictEqual(mockDataReceived);
  });

  it('listByUsers', async () => {
    const mockDataSent = { a: 0 };

    const mockDataReceived = { b: 1 };

    const mockModel = jest.fn();

    const mockList = jest.spyOn(chatService, 'listByUsers').mockReturnValue(mockDataReceived);

    const chat = new Chat({ chatModel: mockModel, ...mockDataSent });

    const data = await chat.listByUsers();

    expect(mockList).toHaveBeenCalledTimes(1);

    expect(mockList).toHaveBeenCalledWith({ data: mockDataSent, Model: mockModel });

    expect(data).toStrictEqual(mockDataReceived);
  });
});
