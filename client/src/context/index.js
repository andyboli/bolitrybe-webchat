import React, { useState, createContext } from 'react';

import PropTypes from 'prop-types';

const Context = createContext();

const Provider = ({ children, event }) => {
  const [message, setMessage] = useState({ value: null, type: null });

  const [user, setUser] = useState(null);

  const context = {
    event,
    message,
    setMessage,
    setUser,
    user,
  };

  return <Context.Provider value={context}>{children}</Context.Provider>;
};

export { Context, Provider };

Provider.propTypes = {
  children: PropTypes.node.isRequired,
};
