import React from 'react';
import { FC } from 'react';
import { Link } from 'react-router-dom';

const Logo: FC = () => {
  return (
    <Link to={`/`} className={`Logo uk-link-reset`}>
      <span className={`uk-visible@s`}>TradeOffer</span>
    </Link>
  );
};

export default Logo;