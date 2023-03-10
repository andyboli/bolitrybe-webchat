import React, { useState, useContext } from 'react';

import { useHistory } from 'react-router-dom';

import Button from 'react-bootstrap/Button';

import Form from 'react-bootstrap/Form';

import { FormGroup, Message, SubmitButton } from '../../components';

import { Context } from '../../context';

import './login.css';

function renderLogin({ setEmail, email, setPassword, password, body, isDisabled }) {
  return (
    <Form>
      <FormGroup callback={setEmail} field="email" state={email} testId="EmailLoginInput" />

      <FormGroup
        callback={setPassword}
        field="password"
        state={password}
        testId="PasswordLoginInput"
      />

      <SubmitButton
        body={body}
        endpoint="/user/login"
        isDisabled={isDisabled}
        label="Login"
        testId="LoginButton"
      />
    </Form>
  );
}

function Login() {
  const { message } = useContext(Context);

  const history = useHistory();

  const [email, setEmail] = useState({ value: null, error: null });

  const [password, setPassword] = useState({ value: null, error: null });

  const body = { email: email.value, password: password.value };

  const isDisabled = !email.value || !password.value || email.error || password.error;

  return (
    <section className="Login">
      <header>
        <h1>Welcome to Bolichat!</h1>
      </header>

      {message.value && <Message />}

      {renderLogin({ setEmail, email, setPassword, password, body, isDisabled })}

      <Button
        className="RegisterLoginButton"
        data-testid="RegisterLoginButton"
        onClick={() => history.push('/register')}
        variant="outline-success"
      >
        Register
      </Button>
    </section>
  );
}

export default Login;
