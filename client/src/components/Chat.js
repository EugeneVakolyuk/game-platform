import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

// Визначаємо URL для Socket.io залежно від середовища
const socketUrl = process.env.NODE_ENV === 'production' ? '/' : 'http://localhost:5000';
const socket = io(socketUrl, {
    auth: {
        token: localStorage.getItem('token'),
    },
});

function Chat() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

    useEffect(() => {
        socket.on('initMessages', (initialMessages) => {
            setMessages(initialMessages.map(msg => `${msg.username}: ${msg.message}`));
        });

        socket.on('message', (msg) => {
            setMessages((prev) => [...prev, `${msg.username}: ${msg.message}`]);
        });

        return () => {
            socket.off('initMessages');
            socket.off('message');
        };
    }, []);

    const sendMessage = () => {
        if (input.trim() && isAuthenticated) {
            socket.emit('sendMessage', input);
            setInput('');
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Глобальний чат</h2>
            <div style={{ height: '200px', overflowY: 'scroll', border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
                {messages.map((msg, index) => (
                    <p key={index}>{msg}</p>
                ))}
            </div>
            {isAuthenticated ? (
                <>
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Введи повідомлення"
                        style={{ width: '80%', padding: '5px' }}
                    />
                    <button onClick={sendMessage} style={{ padding: '5px 10px' }}>Надіслати</button>
                </>
            ) : (
                <p>Будь ласка, увійдіть, щоб писати в чат.</p>
            )}
        </div>
    );
}

export default Chat;