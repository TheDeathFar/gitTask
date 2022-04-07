import React, { FC } from 'react';
import { Link } from 'react-router-dom';

export const MainUnauthorized: FC = () => {
  return (
    <div className={`uk-padding-small`}>
      <div className={`MainWrapper`}>
        <div className={`MainWrapper-content`}>
          <div>
            <h1>⚠️TradeOffer⚠️</h1>
            <h4>Сервис для обмена вещами. Обменяйте старую куртку на новый утюг!</h4>
          </div>
          <div className={`MainWrapper-buttons`} uk-margin={``}>
            <Link to={`/login`} className={`uk-button uk-button-primary`}>Войти</Link>
            <Link to={`/registration`} className={`uk-button uk-button-default`}>Зарегистрироваться</Link>
          </div>
        </div>
      </div>
    </div>
  );
};