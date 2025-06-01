const {
  sendMessage,
  getMessages,
} = require('../controllers/messageController');
const httpMocks = require('node-mocks-http');
const pool = require('../db');

jest.mock('../db');

describe('Message Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('sendMessage', () => {
    it('should return 400 if receiverId or message is missing', async () => {
      const req = httpMocks.createRequest({
        method: 'POST',
        user: { userId: 1 },
        body: { message: '' },
      });
      const res = httpMocks.createResponse();

      await sendMessage(req, res);

      expect(res.statusCode).toBe(400);
    });

    it('should insert message and return 201', async () => {
      pool.query.mockResolvedValue({});

      const req = httpMocks.createRequest({
        method: 'POST',
        user: { userId: 1 },
        body: { receiverId: 2, message: 'Hello' },
      });
      const res = httpMocks.createResponse();

      await sendMessage(req, res);

      expect(res.statusCode).toBe(201);
      expect(res._getJSONData().message).toBe('Message sent');
    });
  });

  describe('getMessages', () => {
    it('should return messages between users', async () => {
      const now = new Date();
      const fakeMessages = [
        {
          sender_id: 1,
          receiver_id: 2,
          message: 'Hi',
          created_at: now.toISOString(),
        },
      ];

      pool.query.mockResolvedValue({ rows: fakeMessages });

      const req = httpMocks.createRequest({
        method: 'GET',
        user: { userId: 1 },
        params: { userId: 2 },
      });
      const res = httpMocks.createResponse();

      await getMessages(req, res);

      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual(fakeMessages);
    });
  });
});
