import React, { FC } from 'react';
import { Route, RouteProps } from 'react-router-dom';
import { useAuthorizedOnly } from '#src/js/hooks/use-authorized-only';

export const AuthorizedRoute: FC<RouteProps> = ({ children, ...rest }) => {
  useAuthorizedOnly();

  return (
    <Route {...rest} >
      {children}
    </Route>
  );
};