import React, { FC } from 'react';
import { Route, RouteProps } from 'react-router-dom';
import { useUnauthorizedOnly } from '#src/js/hooks/use-unauthorized-only';

export const UnauthorizedRoute: FC<RouteProps> = ({ children, ...rest }) => {
  useUnauthorizedOnly();

  return (
    <Route {...rest} >
      {children}
    </Route>
  );
};