import React, { useState, useContext, useEffect } from 'react';

import { useHistory } from 'react-router-dom';

import Button from 'react-bootstrap/Button';

import Form from 'react-bootstrap/Form';

import { LogoutButton, Message } from '../../components';

import { Context } from '../../context';

import handleClick from './handleClick';

import { request } from '../../service';

import './chat.css';

function renderChat({ setContent, content, id, setMessage, setUpdate }) {
  return (
    <Form id="ChatForm">
      <Form.Control
        data-testid="MessageInput"
        onChange={(e) => {
          setContent(e.target.value);
        }}
        placeholder="type a message =)"
        required="required"
        type="text"
      />
      <Button
        className="material-icons"
        data-testid="MessageButton"
        onClick={async (e) => await handleClick({ e, content, id, setMessage, setUpdate })}
        type="submit"
        variant="outline-success"
      >
        near_me
      </Button>
    </Form>
  );
}

function renderMessages({ messages }) {
  return (
    <section className="BoxMessage">
      {messages.map(({ content, user, createdAt, _id }) => {
        return (
          <div className="UserMessage" key={_id}>
            <div className="MessageContent">
              <strong>{user.nickname} :</strong>
              <p>{content}</p>
            </div>
            <div className="MessageDate">
              <em>{createdAt.slice(0, 10)}</em>
              <em>{createdAt.slice(11, 19)}</em>
            </div>
          </div>
        );
      })}
    </section>
  );
}

function renderHeader({ chat, id, user }) {
  return (
    <header>
      {chat.image ? (
        <img src={chat.image} />
      ) : id === 'bolichat' ? (
        <img src={user.image} />
      ) : (
        <p>{chat.nickname || user.nickname}</p>
      )}
      <h1>{chat.title}</h1>
    </header>
  );
}

function Chat({
  match: {
    params: { id },
  },
}) {
  const { event, message, setMessage, user } = useContext(Context);

  const history = useHistory();

  const [chat, setChat] = useState(null);

  const [content, setContent] = useState(null);

  const [messages, setMessages] = useState([]);

  const [update, setUpdate] = useState(true);

  useEffect(() => {
    request.getData({ endpoint: `/chat/${id}` }).then(async ({ data, error }) => {
      if (error) {
        return setMessage({ value: error.message, type: 'ALERT' });
      }

      if (data[0].users) {
        const index = data[0].users.indexOf(user._id) === 0 ? 1 : 0;

        return request
          .getData({ endpoint: `/user/${data[0].users[index]}` })
          .then(({ data: user, error }) => {
            if (error) {
              return setMessage({ value: error.message, type: 'ALERT' });
            }

            setChat({
              title: user.nickname,
              image: user.image,
              nickaname: user.nickname,
            });
          });
      }

      setChat({
        title: data[0].title,
      });
    });
  }, []);

  useEffect(() => {
    request
      .getData({ endpoint: `/message?key=chatId&value=${id}` })
      .then(async ({ data, error }) => {
        if (error) {
          return setMessage({ value: error.message, type: 'ALERT' });
        }

        const messagesList = await Promise.all(
          data.map(async (each) => {
            const { userId, ...chat } = each;

            const { data } = await request.getData({ endpoint: `/user/${userId}` });

            return { ...chat, user: data };
          }),
        );

        setMessages(messagesList);
      });

    event.once('message', (msg) => {
      console.log('msg', msg);
      if (msg.chatId !== id && msg.chatTitle !== id && user !== user.nickname) {
        setMessage({
          value: `${msg.user}: ${
            msg.content.length >= 10 ? msg.content.slice(0, 10) : msg.content
          }... (${msg.chatTitle})`,
          type: 'SUCCESS',
        });
      }

      setUpdate((state) => !state);
    });

    event.on('chat', (msg) => {
      if (msg.chatId !== id) {
        setMessage({
          value: `${msg.user} creat ${msg.title}`,
          type: 'SUCCESS',
        });
      }

      setUpdate((state) => !state);
    });
  }, [update]);

  return (
    <section className="Chat">
      {message.value && <Message />}

      <section className="BoxButtons">
        <Button
          data-testid="PeopleChatButton"
          onClick={() => history.push('/people')}
          variant="outline-success"
        >
          People
        </Button>

        <LogoutButton />
      </section>

      {chat && (
        <section className="BoxChat">
          {renderHeader({ chat, id, user })}

          {renderMessages({ messages })}

          {renderChat({ setContent, content, id, setMessage, setUpdate })}
        </section>
      )}
    </section>
  );
}

export default Chat;
