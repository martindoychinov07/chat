import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMessages, sendMessage, getUsers } from '../api/api';

export default function ChatPage() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const fetchUsers = async () => {
    try {
      const res = await getUsers();
      setUsers(res.data);
      if (res.data.length > 0) {
        setSelectedUser(res.data[0]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMessages = async () => {
    if (!selectedUser) return;
    try {
      const res = await getMessages(selectedUser.id);
      setMessages(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [selectedUser]);

  const handleSend = async () => {
    if (!newMessage.trim() || !selectedUser) return;

    try {
      await sendMessage(selectedUser.id, newMessage);
      setNewMessage('');
      fetchMessages();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ display: 'flex', height: '80vh' }}>
      <div
        style={{ width: '20%', borderRight: '1px solid #ccc', padding: '10px' }}
      >
        <h3>Users</h3>
        {users.length === 0 && <p>No users found.</p>}
        {users.map((user) => (
          <div
            key={user.id}
            onClick={() => setSelectedUser(user)}
            style={{
              cursor: 'pointer',
              padding: '5px',
              backgroundColor:
                selectedUser?.id === user.id ? '#eee' : 'transparent',
            }}
          >
            {user.username}
          </div>
        ))}
      </div>

      <button
        onClick={handleLogout}
        style={{
          position: 'fixed',
          top: '10px',
          right: '10px',
          padding: '8px 12px',
          backgroundColor: '#f44336',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Logout
      </button>

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          padding: '10px',
        }}
      >
        <h3>Chat with {selectedUser ? selectedUser.username : '...'}</h3>
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            border: '1px solid #ccc',
            padding: '10px',
            marginBottom: '10px',
          }}
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                marginBottom: '8px',
                textAlign: msg.sender_id === selectedUser.id ? 'left' : 'right',
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  padding: '6px 12px',
                  borderRadius: '12px',
                  backgroundColor:
                    msg.sender_id === selectedUser.id ? '#f0f0f0' : '#4caf50',
                  color: msg.sender_id === selectedUser.id ? '#000' : '#fff',
                }}
              >
                {msg.message}
              </span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex' }}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            style={{ flex: 1, padding: '8px' }}
            placeholder="Type your message..."
          />
          <button onClick={handleSend} style={{ padding: '8px 16px' }}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
