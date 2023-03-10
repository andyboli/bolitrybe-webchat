require('dotenv').config();

const cors = require('cors');

const bodyParser = require('body-parser');

const path = require('path');

const express = require('express');

const app = express();

const socketIoServer = require('http').createServer();

const event = require('socket.io')(socketIoServer);

const middlewares = require('./middlewares');

const { chatRouter, messageRouter, userRouter } = require('./app');

const { Chat, Message, User } = require('./env');

const { chatModel, messageModel, userModel } = require('./resource');

app.use(express.json());

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use(cors());

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/chat', chatRouter({ Chat, chatModel, middlewares, event }));

app.use('/message', messageRouter({ Message, messageModel, middlewares, event }));

app.use('/user', userRouter({ User, userModel, middlewares, event }));

app.use(middlewares.error({ event }));

module.exports = { app, io: event };
