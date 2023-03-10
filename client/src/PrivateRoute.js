import React, { useContext, useEffect, useState } from 'react';

import { Redirect, Route } from 'react-router-dom';

import { Context } from './context';

import { request } from './service';

function PrivateRoute({ component: Component, ...rest }) {
  const { setMessage, setUser } = useContext(Context);

  const [isAuthorized, setIsAuthorized] = useState(false);

  const [isTokenValidated, setIsTokenValidated] = useState(false);

  useEffect(() => {
    request.validToken({ endpoint: '/user/token' }).then(({ data, error }) => {
      if (error) {
        setIsAuthorized(false);

        return setMessage({ value: error.message, type: 'ALERT' });
      }
      console.log('Private Router user', data);
      setUser(data);

      setIsAuthorized(true);

      setIsTokenValidated(true);
    });
  }, []);

  return isTokenValidated ? (
    <Route
      {...rest}
      render={(props) => {
        return isAuthorized ? <Component {...props} /> : <Redirect to="/" />;
      }}
    />
  ) : (
    <div>Validating Token...</div>
  );
}

export default PrivateRoute;
