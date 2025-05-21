require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/auth');
const jwt = require('jsonwebtoken');
const Message = require('./models/Message');
const User = require('./models/User');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ['http://localhost:3000', process.env.CLIENT_URL || 'https://your-app.onrender.com' ], // Дозволяємо фронтенду підключатися
        methods: ['GET', 'POST'],
    },
});

// Налаштування middleware
app.use(cors());
app.use(express.json());

// Підключення маршрутів
app.use('/api/auth', authRoutes);

// Обслуговування статичних файлів фронтенду
app.use(express.static(path.join(__dirname, 'client', 'build')));

// Перенаправлення всіх не-API запитів на React
app.get('/{*splat}', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

// Підключення до MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    serverApi: {
        version: '1',
        strict: true,
        deprecationErrors: true,
    },
}).then(() => console.log('MongoDB Atlas підключено'))
    .catch(err => console.error('Помилка підключення до MongoDB Atlas:', err));

// Socket.io із перевіркою авторизації
io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (token) {
        try {
            const decoded = jwt.verify(token, 'secret_key');
            socket.userId = decoded.id;
            next();
        } catch (err) {
            next(new Error('Невірний токен'));
        }
    } else {
        next(new Error('Токен не надано'));
    }
});

// Налаштування Socket.io для чату
io.on('connection', async (socket) => {
    const messages = await Message.find().sort({ timestamp: -1 }).limit(100).populate('userId', 'username');
    socket.emit('initMessages', messages.reverse());

    socket.on('sendMessage', async (messageText) => {
        if (!socket.userId) return;
        const user = await User.findById(socket.userId);
        if (!user) return;

        const message = new Message({ userId: user._id, username: user.username, message: messageText });
        await message.save();
        user.messagesSent += 1;
        await user.save();

        io.emit('message', { username: user.username, message: messageText });
    });
});

// Запуск сервера
server.listen(process.env.PORT || 5000, () => {
    console.log(`Сервер запущено на порту http://localhost:${process.env.PORT || 5000}`);
});