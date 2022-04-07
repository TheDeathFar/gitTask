import React from 'react';
import { NavLink } from 'react-router-dom';
import Logo from '#components/logo/logo';
import { useSelector } from 'react-redux';
import {
  basketDesiredLengthSelector,
  basketOfferedLengthSelector,
  isAdminSelector,
  isAuthorizedSelector,
  isUserSelector,
  userPhotoUrlSelector,
} from '#redux/selectors';
import userBox from '#src/icons/user-box.svg';
import boxList from '#src/icons/box-list.svg';
import cart from '#src/icons/shopping-cart.svg';
import trades from '#src/icons/trades.svg';

const Header: React.FC = () => {
  const activeClassName = `active uk-card-default`;
  const isAuthorized = useSelector(isAuthorizedSelector);
  const isAdmin = useSelector(isAdminSelector);
  const isUser = useSelector(isUserSelector);
  const userPhotoUrl = useSelector(userPhotoUrlSelector);
  const offeredLength = useSelector(basketOfferedLengthSelector);
  const desiredLength = useSelector(basketDesiredLengthSelector);

  return (
    <div className={`uk-width-auto uk-flex uk-flex-center uk-padding-small uk-flex-wrap`}>
      {/* Левая часть хедера */}
      <div className={`uk-width-1-5 uk-width-1-4@m uk-flex uk-flex-left`}>
        <Logo />
      </div>

      {/* Середина */}
      <div className={`uk-width-expand uk-flex uk-flex-center`}>
        <NavLink activeClassName={activeClassName} exact to={(isAdmin) ? `/admin` : `/`} className={`Header-link`}
                 uk-icon={`icon: home`} />
        {(isUser) ? (
          <>
            <NavLink activeClassName={activeClassName} to={`/items`}
                     className={`Header-link uk-icon`}>
              <img className={`uk-icon-image`} src={userBox} alt={``} uk-svg={``} />
            </NavLink>
            <NavLink activeClassName={activeClassName} to={`/catalogue`}
                     className={`Header-link uk-icon`}>
              <img className={`uk-icon-image`} src={boxList} alt={``} uk-svg={``} />
            </NavLink>
            <NavLink activeClassName={activeClassName} to={`/trades`}
                     className={`Header-link uk-icon`}>
              <img className={`uk-icon-image`} src={trades} alt={``} uk-svg={``} />
            </NavLink>
          </>
        ) : null}

        {(isAdmin) ? (
          <>
            <NavLink activeClassName={activeClassName} to={`/admin/users`} className={`Header-link`}
                     uk-icon={`icon: users`} />
            <NavLink activeClassName={activeClassName} to={`/admin/categories`} className={`Header-link`}
                     uk-icon={`icon: hashtag`} />
          </>
        ) : null}
      </div>

      {/* Правая часть хедера */}
      <div className={`uk-width-1-5 uk-width-1-4@m uk-flex uk-flex-right`}>
        {(isUser) ? (
          <NavLink activeClassName={activeClassName} to={`/basket`}
                   className={`Header-link uk-icon uk-position-relative`}>
            <div
              className={`Header-linkIcon Header-linkIcon--paddingFreeHorizontal uk-position-absolute uk-flex uk-flex-column uk-flex-middle uk-flex-center`}>
              <img alt={`basket`} className={`uk-icon uk-icon-image`} src={cart} uk-svg={``} />
              <div className={`Header-linkIconLabel uk-width-1-1 uk-flex uk-child-width-expand`}>
                <div className={`uk-text-right`}>
                  {offeredLength}
                </div>
                <div className={`uk-text-center`}>
                  <span>:</span>
                </div>
                <div>
                  {desiredLength}
                </div>
              </div>
            </div>
          </NavLink>
        ) : null}
        {(isAuthorized) ? (
          <>

            <NavLink activeClassName={activeClassName} exact to={`/profile`}
                     className={`Header-link${(userPhotoUrl) ? ` Header-link--withImage` : ``}`}
                     style={{
                       backgroundImage: (userPhotoUrl)
                         ? `url(${userPhotoUrl})`
                         : ``,
                     }} uk-icon={`icon: user`} />
            <NavLink activeClassName={activeClassName} exact to={`/logout`} className={`Header-link`}
                     uk-icon={`icon: sign-out`} />
          </>
        ) : (
          <NavLink activeClassName={activeClassName} exact to={`/login`} className={`Header-link`}
                   uk-icon={`icon: sign-in`}
                   isActive={
                     (match, location) =>
                       location.pathname.includes(`login`) ||
                       location.pathname.includes(`registration`)
                   }
          />
        )}

      </div>

    </div>
  );
};

export default Header;
