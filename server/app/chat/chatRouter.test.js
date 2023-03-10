const request = require('supertest');

const faker = require('faker');

const chatIdRandom = require('mongoose').Types.ObjectId();

const { app } = require('../../apps');

afterEach(async () => {
  jest.clearAllMocks();
});

jest.setTimeout(30000);

describe('Chat Router', () => {
  let mockTokenA, mockTokenB, mockTokenC, mockIdA, mockIdB, mockIdC;

  const mockUserA = {
    email: faker.internet.email(),
    nickname: faker.name.firstName(),
    password: faker.internet.password(),
  };

  const mockUserB = {
    email: faker.internet.email(),
    nickname: faker.name.firstName(),
    password: faker.internet.password(),
  };

  const mockUserC = {
    email: faker.internet.email(),
    nickname: faker.name.firstName(),
    password: faker.internet.password(),
  };

  describe('Post /chat', () => {
    it('on succes - create chat', async () => {
      const {
        body: { token: TokenA, _id: IdA },
      } = await request.agent(app).post('/user').send(mockUserA);

      mockTokenA = TokenA;

      mockIdA = IdA;

      const {
        body: { token: TokenB, _id: IdB },
      } = await request.agent(app).post('/user').send(mockUserB);

      mockTokenB = TokenB;

      mockIdB = IdB;

      const {
        body: { token: TokenC, _id: IdC },
      } = await request.agent(app).post('/user').send(mockUserC);

      mockTokenC = TokenC;

      mockIdC = IdC;

      const mockDataSent = { users: [mockIdA, mockIdB, mockIdC], userId: mockIdA };

      const response = await request
        .agent(app)
        .post('/chat')
        .set('Authorization', mockTokenA)
        .send(mockDataSent);

      expect(response.error).toBeFalsy();

      expect(response.status).toBe(201);

      expect(response.body._id).toBeTruthy();

      mockId = response.body._id;

      expect(response.body.isPrivate).toBeFalsy();

      expect(response.body.users).toStrictEqual([mockIdA, mockIdB, mockIdC]);
    });

    it('on failure - invalid data', async () => {
      const {
        body: { token: mockTokenUser, _id: mockIdUser },
      } = await request.agent(app).post('/user').send({
        email: faker.internet.email(),
        nickname: faker.name.firstName(),
        password: faker.internet.password(),
      });

      const mockDataSent = { users: [mockIdUser], other: 'bolivar' };

      const mockError = {
        error: {
          details: ['users must contain at least two users', '"other" is not allowed'],
          message: 'Invalid Data',
        },
      };

      const response = await request
        .agent(app)
        .post('/chat')
        .set('Authorization', mockTokenUser)
        .send(mockDataSent);

      expect(response.status).toBe(400);

      expect(JSON.parse(response.text)).toStrictEqual(mockError);
    });
  });

  describe('Get  /chat/id', () => {
    it('on succes - find chat', async () => {
      const response = await request
        .agent(app)
        .get(`/chat/${mockId}`)
        .set('Authorization', mockTokenA);

      expect(response.status).toBe(200);

      expect(response.body.createdAt).toBeTruthy();

      expect(response.body.users).toStrictEqual([mockIdA, mockIdB, mockIdC]);

      expect(response.body.isPrivate).toBeFalsy();
    });

    it('on failure - no authentication', async () => {
      const mockError = {
        error: {
          details: null,
          message: 'Token not found',
        },
      };

      const response = await request.agent(app).get(`/chat/${mockId}`);

      expect(response.status).toBe(401);

      expect(JSON.parse(response.text)).toStrictEqual(mockError);
    });

    it('on failure - not found', async () => {
      const mockError = {
        error: {
          details: null,
          message: 'Chat não encontrado',
        },
      };

      const response = await request
        .agent(app)
        .get(`/chat/${chatIdRandom}`)
        .set('Authorization', mockTokenA);

      expect(response.status).toBe(400);

      expect(JSON.parse(response.text)).toStrictEqual(mockError);
    });
  });

  describe('Get /chat', () => {
    it('on succes - list chat by users', async () => {
      const response = await request
        .agent(app)
        .post(`/chat/user`)
        .set('Authorization', mockTokenA)
        .send({ users: [mockIdA, mockIdC] });

      expect(response.status).toBe(200);

      expect(response.body[0].createdAt).toBeTruthy();

      expect(response.body[0].users).toStrictEqual([mockIdA, mockIdB, mockIdC]);
    });
  });

  describe('Get /chat', () => {
    it('on succes - list chat by userId', async () => {
      const response = await request
        .agent(app)
        .get(`/chat/user/${mockIdA}`)
        .set('Authorization', mockTokenA);

      expect(response.status).toBe(200);

      expect(response.body[0].userId).toBe(mockIdA);

      await request.agent(app).delete(`/user/${mockIdA}`).set('Authorization', mockTokenA);

      await request.agent(app).delete(`/user/${mockIdB}`).set('Authorization', mockTokenB);

      await request.agent(app).delete(`/user/${mockIdC}`).set('Authorization', mockTokenC);
    });
  });
});
