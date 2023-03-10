import React, { useContext } from 'react';

import Button from 'react-bootstrap/Button';

import { useHistory } from 'react-router-dom';

import { Context } from '../../context';

import handleClick from './handleClick';
import './logoutButton.css';

function LogoutButton() {
  const { event, setMessage, user } = useContext(Context);

  const history = useHistory();

  return (
    <Button
      className="LogoutButton"
      data-testid="LogoutButton"
      onClick={async () => {
        await handleClick({ setMessage, event, user, history });
      }}
      variant="outline-danger"
    >
      Logout
    </Button>
  );
}

export default LogoutButton;
