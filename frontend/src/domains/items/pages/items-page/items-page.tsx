import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import { ItemsList } from '../../components/items-list/items-list';
import { Actions } from '#components/actions/actions';

export const ItemsPage: FC = () => {
  return (
    <>
      <Actions>
        <Link to={`/items/add`} className={`uk-button uk-button-default uk-flex uk-flex-middle`}>
          <span className={`Actions-icon`} uk-icon={`icon: plus`} />
          <span className={`uk-margin-small-left uk-visible@s`}>Вещь</span>
        </Link>
      </Actions>

      <ItemsList />
    </>
  );
};