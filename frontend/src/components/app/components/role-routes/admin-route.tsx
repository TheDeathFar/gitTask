import React, { FC } from 'react';
import { Route, RouteProps } from 'react-router-dom';
import { useAdminOnly } from '#src/js/hooks/use-admin-only';

export const AdminRoute: FC<RouteProps> = ({ children, ...rest }) => {
  useAdminOnly();

  return (
    <Route {...rest} >
      {children}
    </Route>
  );
};