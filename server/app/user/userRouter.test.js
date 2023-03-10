const request = require('supertest');

const faker = require('faker');

const { app } = require('../../apps');

const userIdRandom = require('mongoose').Types.ObjectId();

afterEach(() => {
  jest.clearAllMocks();
});

jest.setTimeout(30000);

describe('User Router', () => {
  let mockToken, mockId;

  const mockEmail = faker.internet.email();

  const mockPassword = faker.internet.password(10);

  const mockNickname = faker.name.findName();

  const mockNewNickname = faker.name.findName();

  describe('Post /user', () => {
    it('on succes - create user', async () => {
      const mockDataSent = {
        email: mockEmail,
        nickname: mockNickname,
        password: mockPassword,
      };

      const response = await request.agent(app).post('/user').send(mockDataSent);

      expect(response.error).toBeFalsy();

      expect(response.status).toBe(201);

      expect(response.body.token).toBeTruthy();

      mockToken = response.body.token;

      expect(response.body._id).toBeTruthy();

      mockId = response.body._id;

      expect(response.body.nickname).toBe(mockNickname);

      expect(response.body.email).toBe(mockEmail);

      expect(response.body.password).toBeFalsy();
    });

    it('on failure - invalid data', async () => {
      const mockDataSent = {
        email: 'invalidEmail',
        password: 'wrong',
      };

      const mockError = {
        error: {
          details: [
            'email must be in a format <name>@<domain>',
            'nickname is required',
            'password length must be at least 6 characters long',
          ],
          message: 'Invalid Data',
        },
      };

      const response = await request.agent(app).post('/user').send(mockDataSent);

      expect(response.status).toBe(400);

      expect(JSON.parse(response.text)).toStrictEqual(mockError);
    });

    it('on failure - email already exists', async () => {
      const mockDataSent = {
        email: mockEmail,
        nickname: mockNewNickname,
        password: mockPassword,
      };

      const mockError = {
        error: {
          details: null,
          message: 'Já existe um usuário com este email',
        },
      };

      const response = await request.agent(app).post('/user').send(mockDataSent);

      expect(response.status).toBe(400);

      expect(JSON.parse(response.text)).toStrictEqual(mockError);
    });

    it('on failure - nickaname already exists', async () => {
      const mockDataSent = {
        email: faker.internet.email(),
        nickname: mockNickname,
        password: mockPassword,
      };

      const mockError = {
        error: {
          details: null,
          message: 'Já existe um usuário com este nickname',
        },
      };

      const response = await request.agent(app).post('/user').send(mockDataSent);

      expect(response.status).toBe(400);

      expect(JSON.parse(response.text)).toStrictEqual(mockError);
    });
  });

  describe('POST /user/login', () => {
    it('on success', async () => {
      const mockUserLogin = {
        password: mockPassword,
        email: mockEmail,
      };

      const response = await request.agent(app).post('/user/login').send(mockUserLogin);

      mockToken = response.body.token;

      expect(response.status).toBe(200);

      expect(response.body.token).toBeTruthy();

      expect(response.body._id).toBe(mockId);

      expect(response.body.nickname).toBe(mockNickname);

      expect(response.body.email).toBe(mockEmail);

      expect(response.body.password).toBeFalsy();
    });

    it('on faliure - invalid data', async () => {
      const mockUserLogin = {
        password: '123',
        email: faker.name.firstName(),
      };

      const mockError = {
        error: {
          message: 'Invalid Data',
          details: [
            'email must be in a format <name>@<domain>',
            'password length must be at least 6 characters long',
          ],
        },
      };

      const response = await request.agent(app).post('/user/login').send(mockUserLogin);

      expect(response.status).toBe(400);

      expect(JSON.parse(response.text)).toStrictEqual(mockError);
    });

    it('on faliure - user not exists', async () => {
      const mockUserLogin = {
        password: faker.lorem.words(10),
        email: faker.internet.email(),
      };

      const mockError = {
        error: {
          details: null,
          message: 'Usuário não encontrado',
        },
      };

      const response = await request.agent(app).post('/user/login').send(mockUserLogin);

      expect(response.status).toBe(400);

      expect(JSON.parse(response.text)).toStrictEqual(mockError);
    });

    it('on faliure - wrong password', async () => {
      const mockUserLogin = {
        password: faker.lorem.words(10),
        email: mockEmail,
      };

      const mockError = {
        error: {
          details: null,
          message: 'Senha incorreta',
        },
      };

      const response = await request.agent(app).post('/user/login').send(mockUserLogin);

      expect(response.status).toBe(400);

      expect(JSON.parse(response.text)).toStrictEqual(mockError);
    });
  });

  describe('Get /user', () => {
    it('on succes - list users', async () => {
      const mockUser = {
        _id: mockId,
        email: mockEmail,
        nickname: mockNickname,
      };

      const response = await request.agent(app).get('/user').set('Authorization', mockToken);

      const users = JSON.parse(response.text);

      expect(response.status).toBe(200);

      expect(users[users.length - 1]).toStrictEqual(mockUser);
    });

    it('on failure - no authentication', async () => {
      const mockError = {
        error: {
          details: null,
          message: 'Token not found',
        },
      };

      const response = await request.agent(app).get('/user');

      expect(response.status).toBe(401);

      expect(JSON.parse(response.text)).toStrictEqual(mockError);
    });
  });

  describe('Patch  /user/id', () => {
    it('on success - change nickname', async () => {
      const mockUser = {
        _id: mockId,
        email: mockEmail,
        nickname: mockNewNickname,
      };

      const response = await request
        .agent(app)
        .patch(`/user/${mockId}`)
        .set('Authorization', mockToken)
        .send({ nickname: mockNewNickname });

      expect(response.status).toBe(200);

      expect(JSON.parse(response.text)).toStrictEqual(mockUser);
    });

    it('on failure - no authentication', async () => {
      const mockError = {
        error: {
          details: null,
          message: 'Token not found',
        },
      };

      const response = await request
        .agent(app)
        .patch(`/user/${mockId}`)
        .send({ nickname: mockNewNickname });

      expect(response.status).toBe(401);

      expect(JSON.parse(response.text)).toStrictEqual(mockError);
    });

    it('on failure - user not found', async () => {
      const mockError = {
        error: {
          details: null,
          message: 'Usuário não encontrado',
        },
      };

      const response = await request
        .agent(app)
        .patch(`/user/${userIdRandom}`)
        .set('Authorization', mockToken)
        .send({ nickname: mockNewNickname });

      expect(response.status).toBe(400);

      expect(JSON.parse(response.text)).toStrictEqual(mockError);
    });
  });

  describe('Get  /user/id', () => {
    it('on succes - find user', async () => {
      const mockUser = {
        _id: mockId,
        email: mockEmail,
        nickname: mockNewNickname,
      };

      const response = await request
        .agent(app)
        .get(`/user/${mockId}`)
        .set('Authorization', mockToken);

      expect(response.status).toBe(200);

      expect(JSON.parse(response.text)).toStrictEqual(mockUser);
    });

    it('on failure - no authentication', async () => {
      const mockError = {
        error: {
          details: null,
          message: 'Token not found',
        },
      };

      const response = await request.agent(app).get(`/user/${mockId}`);

      expect(response.status).toBe(401);

      expect(JSON.parse(response.text)).toStrictEqual(mockError);
    });
  });

  describe('Delete  /user/id', () => {
    it('on succes', async () => {
      const response = await request
        .agent(app)
        .delete(`/user/${mockId}`)
        .set('Authorization', mockToken);

      expect(response.status).toBe(204);
    });
  });

  describe('User not found', () => {
    it('GET /user/id', async () => {
      const mockError = {
        error: {
          details: null,
          message: 'Error by looking a user with this token',
        },
      };

      const response = await request
        .agent(app)
        .get(`/user/${mockId}`)
        .set('Authorization', mockToken);

      expect(response.status).toBe(401);

      expect(JSON.parse(response.text)).toStrictEqual(mockError);
    });
  });
});
