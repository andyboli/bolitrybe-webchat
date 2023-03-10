import React, { useState, useContext } from 'react';

import Form from 'react-bootstrap/Form';

import { FormGroup, Message, SubmitButton } from '../../components';

import { Context } from '../../context';

import './register.css';

function renderRegister({
  setEmail,
  email,
  setNickname,
  nickname,
  setPassword,
  password,
  body,
  isDisabled,
  message,
}) {
  return (
    <section className="Register">
      <header>
        <h1>Register</h1>
      </header>

      {message.value && <Message infinity />}
      <Form>
        <FormGroup callback={setEmail} field="email" state={email} testId="EmailRegisterInput" />

        <FormGroup
          callback={setNickname}
          field="nickname"
          state={nickname}
          testId="NicknameRegisterInput"
        />

        <FormGroup
          callback={setPassword}
          field="password"
          state={password}
          testId="PasswordRegisterInput"
        />

        <SubmitButton
          body={body}
          endpoint="/user"
          isDisabled={isDisabled}
          label="Create User"
          testId="RegisterButton"
        />
      </Form>
    </section>
  );
}

const Register = () => {
  const { message } = useContext(Context);

  const [email, setEmail] = useState({ value: null, error: null });

  const [nickname, setNickname] = useState({ value: null, error: null });

  const [password, setPassword] = useState({ value: null, error: null });

  const body = {
    email: email.value,
    nickname: nickname.value,
    password: password.value,
  };

  const isDisabled = !email.value || email.error || nickname.error ||
    !nickname.value || password.error || !password.value;

  return renderRegister({
    setEmail, email, setNickname, nickname, setPassword,
    password, body, isDisabled, message,
  });
};

export default Register;
