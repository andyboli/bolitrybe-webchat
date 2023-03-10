import React, { useContext } from 'react';

import Button from 'react-bootstrap/Button';

import { useHistory } from 'react-router-dom';

import { Context } from '../../context';

import handleSubmit from './handleSubmit';

import './submitButton.css';

function SubmitButton({ body, endpoint, isDisabled, label, testId }) {
  const { setMessage, setUser } = useContext(Context);

  const history = useHistory();

  return (
    <Button
      className="SubmitButton"
      data-testid={testId}
      disabled={isDisabled}
      onClick={async (e) => await handleSubmit({ body, e, endpoint, history, setMessage, setUser })}
      type="submit"
      variant="outline-success"
    >
      {label}
    </Button>
  );
}

export default SubmitButton;
