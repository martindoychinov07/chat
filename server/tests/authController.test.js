const { registerUser, loginUser } = require('../controllers/authController');
const httpMocks = require('node-mocks-http');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');

jest.mock('../db');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('Auth Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('registerUser', () => {
    it('should return 400 if missing fields', async () => {
      const req = httpMocks.createRequest({
        method: 'POST',
        body: { username: '', email: '', password: '' }
      });
      const res = httpMocks.createResponse();

      await registerUser(req, res);

      expect(res.statusCode).toBe(400);
      expect(res._getJSONData().message).toBe("Please provide username, email, and password");
    });

    it('should return 400 if user exists', async () => {
      pool.query.mockResolvedValueOnce({ rows: [{}] });

      const req = httpMocks.createRequest({
        method: 'POST',
        body: { username: 'test', email: 'test@test.com', password: '123' }
      });
      const res = httpMocks.createResponse();

      await registerUser(req, res);

      expect(res.statusCode).toBe(400);
      expect(res._getJSONData().message).toBe("Username or email already exists");
    });

    it('should register a user and return token', async () => {
      pool.query
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({ rows: [{ id: 1, username: 'test' }] });

      bcrypt.hash.mockResolvedValue('hashedPassword');
      jwt.sign.mockReturnValue('token123');

      const req = httpMocks.createRequest({
        method: 'POST',
        body: { username: 'test', email: 'test@test.com', password: '123' }
      });
      const res = httpMocks.createResponse();

      await registerUser(req, res);

      expect(res.statusCode).toBe(201);
      expect(res._getJSONData().token).toBe('token123');
    });
  });

  describe('loginUser', () => {
    it('should return 400 if missing fields', async () => {
      const req = httpMocks.createRequest({
        method: 'POST',
        body: { username: '', password: '' }
      });
      const res = httpMocks.createResponse();

      await loginUser(req, res);

      expect(res.statusCode).toBe(400);
    });

    it('should return 400 if user not found', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const req = httpMocks.createRequest({
        method: 'POST',
        body: { username: 'missing', password: '123' }
      });
      const res = httpMocks.createResponse();

      await loginUser(req, res);

      expect(res.statusCode).toBe(400);
    });

    it('should login user and return token', async () => {
      pool.query.mockResolvedValue({
        rows: [{ id: 1, username: 'test', password: 'hashed' }]
      });

      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('token456');

      const req = httpMocks.createRequest({
        method: 'POST',
        body: { username: 'test', password: '123' }
      });
      const res = httpMocks.createResponse();

      await loginUser(req, res);

      expect(res.statusCode).toBe(200);
      expect(res._getJSONData().token).toBe('token456');
    });
  });
});
