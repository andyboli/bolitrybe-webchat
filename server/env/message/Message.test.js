const messageService = require('./messageService');

const Message = require('./Message');

const faker = require('faker');

describe('Message', () => {
  it('Create', async () => {
    const mockDataSent = { a: 0 };

    const mockDataReceived = { b: 1 };

    const mockId = faker.random.number();

    const mockModel = jest.fn();

    const mockCreate = jest.spyOn(messageService, 'create').mockReturnValue(mockDataReceived);

    const message = new Message({ messageModel: mockModel, id: mockId, ...mockDataSent });

    const data = await message.create();

    expect(mockCreate).toHaveBeenCalledTimes(1);

    expect(mockCreate).toHaveBeenCalledWith({ Model: mockModel, data: mockDataSent });

    expect(data).toStrictEqual(mockDataReceived);
  });

  it('ListBy', async () => {
    const mockDataSent = { a: 0 };

    const mockDataReceived = { b: 1 };

    const mockField = faker.random.word();

    const mockModel = jest.fn();

    const mockList = jest.spyOn(messageService, 'listBy').mockReturnValue(mockDataReceived);

    const message = new Message({ messageModel: mockModel, ...mockDataSent });

    const data = await message.listBy(mockField);

    expect(mockList).toHaveBeenCalledTimes(1);

    expect(mockList).toHaveBeenCalledWith({
      field: mockField,
      Model: mockModel,
      data: mockDataSent,
    });

    expect(data).toStrictEqual(mockDataReceived);
  });
});
