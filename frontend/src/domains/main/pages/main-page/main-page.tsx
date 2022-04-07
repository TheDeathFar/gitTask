import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { isAdminSelector, isUserSelector } from '#redux/selectors';
import { Redirect } from 'react-router-dom';
import { MainUser } from '#domains/main/components/main-user/main-user';
import { MainUnauthorized } from '#domains/main/components/main-unauthorized/main-unauthorized';

const MainPage: FC = () => {
  const isAdmin = useSelector(isAdminSelector);
  const isUser = useSelector(isUserSelector);

  if (isAdmin)
    return <Redirect to={`admin`} />;

  if (isUser)
    return <MainUser />;

  return <MainUnauthorized />;

};

export default MainPage;
