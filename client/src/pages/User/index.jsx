import React, { useContext, useEffect, useState } from 'react';

import { useHistory } from 'react-router-dom';

import Button from 'react-bootstrap/Button';

import Form from 'react-bootstrap/Form';

import { FormGroup, Message } from '../../components';

import { Context } from '../../context';

import { handleClick, handleSubmit } from './handleClick';

import './user.css';

function renderUser({ body, history, setMessage, setNickname, nickname, image, user, setImage }) {
  return (
    <section>
      <Form>
        <FormGroup
          callback={setNickname}
          field="nickname"
          state={nickname}
          testId="nickname-update-input"
        />
        <Button
          type="submit"
          value="submit"
          variant="outline-info"
          onClick={async (event) =>
            await handleClick({ event, body, history, endpoint: `/user/${user._id}`, setMessage })
          }
        >
          Update Nickname
        </Button>
      </Form>

      <Form method="patch" encType="multipart/form-data" className="image-form">
        <input
          id="image"
          type="file"
          name="image"
          accept=".jpg, .jpeg, .png"
          onChange={(e) => setImage(e.target.files[0])}
        />

        <Button
          type="submit"
          value="submit"
          variant="outline-info"
          onClick={(event) =>
            handleSubmit({
              event,
              image,
              setMessage,
              history,
              endpoint: `/user/${user._id}/image`,
            })
          }
        >
          Update Image
        </Button>
      </Form>
    </section>
  );
}

function User() {
  const { message, setMessage, user, setUser } = useContext(Context);

  const history = useHistory();

  const [nickname, setNickname] = useState({ value: null, error: null });

  const [image, setImage] = useState(null);

  const body = { nickname: nickname.value };

  return (
    <section className="boxUser">
      <Button
        className="people-button"
        variant="outline-danger"
        onClick={() => history.push('/people')}
      >
        People
      </Button>

      {message.value && <Message />}

      {renderUser({ body, history, setMessage, setNickname, nickname, image, user, setImage })}
    </section>
  );
}

export default User;
