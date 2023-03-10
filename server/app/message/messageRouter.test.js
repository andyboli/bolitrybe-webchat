const request = require('supertest');

const faker = require('faker');

const chatId = require('mongoose').Types.ObjectId();

const mockChatId = `${chatId}`;

const { app } = require('../../apps');

afterEach(async () => {
  jest.clearAllMocks();
});

jest.setTimeout(30000);

describe('Message Router', () => {
  let mockToken, mockId;

  const mockContent = faker.lorem.words();

  const mockNickname = faker.name.firstName();

  const mockUser = {
    email: faker.internet.email(),
    nickname: mockNickname,
    password: faker.internet.password(),
  };

  describe('Post /message', () => {
    it('on succes - create message', async () => {
      const mockDataSent = {
        chatId: mockChatId,
        content: mockContent,
      };

      const {
        body: { token, _id },
      } = await request.agent(app).post('/user').send(mockUser);

      mockToken = token;

      mockId = _id;

      const response = await request
        .agent(app)
        .post('/message')
        .set('Authorization', mockToken)
        .send(mockDataSent);

      expect(response.error).toBeFalsy();

      expect(response.status).toBe(201);

      expect(response.body._id).toBeTruthy();

      expect(response.body.content).toBe(mockContent);

      expect(response.body.userId).toBe(mockId);

      expect(response.body.chat).toBeTruthy();

      await request.agent(app).delete(`/user/${_id}`).set('Authorization', token);
    });

    it('on failure - invalid data', async () => {
      const mockDataSent = {
        chatId: mockChatId,
        content: '',
      };

      const {
        body: { token, _id },
      } = await request.agent(app).post('/user').send({
        email: faker.internet.email(),
        nickname: faker.name.firstName(),
        password: faker.internet.password(),
      });

      const mockError = {
        error: {
          details: ['content is not allowed to be empty'],
          message: 'Invalid Data',
        },
      };

      const response = await request
        .agent(app)
        .post('/message')
        .set('Authorization', token)
        .send(mockDataSent);

      expect(response.status).toBe(400);

      expect(JSON.parse(response.text)).toStrictEqual(mockError);

      await request.agent(app).delete(`/user/${_id}`).set('Authorization', token);
    });
  });

  describe('Get /message', () => {
    it('on succes - list messages', async () => {
      const {
        body: { token, _id },
      } = await request.agent(app).post('/user').send(mockUser);

      const response = await request
        .agent(app)
        .get(`/message`)
        .query({ key: 'chatId', value: mockChatId })
        .set('Authorization', token);

      const messages = JSON.parse(response.text);

      expect(response.status).toBe(200);

      expect(messages[messages.length - 1].content).toBe(mockContent);

      await request.agent(app).delete(`/user/${_id}`).set('Authorization', token);
    });

    it('on failure - no authentication', async () => {
      const mockError = {
        error: {
          details: null,
          message: 'Token not found',
        },
      };

      const response = await request.agent(app).get('/message');

      expect(response.status).toBe(401);

      expect(JSON.parse(response.text)).toStrictEqual(mockError);
    });
  });
});
