import React, { FC } from 'react';
import { Route, RouteProps } from 'react-router-dom';
import { useUserOnly } from '#src/js/hooks/use-user-only';

export const UserRoute: FC<RouteProps> = ({ children, ...rest }) => {
  useUserOnly();

  return (
    <Route {...rest} >
      {children}
    </Route>
  );
};