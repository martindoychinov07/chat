const pool = require('../db');

async function sendMessage(req, res) {
  const senderId = req.user.userId;
  const { receiverId, message } = req.body;

  if (!receiverId || !message) {
    return res
      .status(400)
      .json({ message: 'receiverId and message are required' });
  }

  try {
    await pool.query(
      'INSERT INTO messages (sender_id, receiver_id, message) VALUES ($1, $2, $3)',
      [senderId, receiverId, message]
    );
    res.status(201).json({ message: 'Message sent' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}

async function getMessages(req, res) {
  const userId = req.user.userId;
  const otherUserId = req.params.userId;

  try {
    const result = await pool.query(
      `SELECT * FROM messages
       WHERE (sender_id = $1 AND receiver_id = $2)
          OR (sender_id = $2 AND receiver_id = $1)
       ORDER BY created_at ASC`,
      [userId, otherUserId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { sendMessage, getMessages };
