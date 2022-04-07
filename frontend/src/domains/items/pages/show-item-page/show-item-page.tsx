import React, { FC, useEffect, useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import {
  currentItemErrorSelector,
  currentItemSelector,
  isCurrentItemRequestPendingSelector,
  userDataSelector,
} from '#redux/selectors';
import { useSelector } from 'react-redux';
import { PhotosSlideshow } from '#domains/items/components/photos-slideshow/photos-slideshow';
import { Operations } from '#redux/operations/operations';
import { useAppDispatch } from '#redux/store';
import { ItemActions } from '#redux/reducers/slices/item-slice';
import { AddToCart } from '#domains/items/components/add-to-cart/add-to-cart';

export const ShowItemPage: FC = () => {
  const history = useHistory();
  const { itemId } = useParams<{ itemId: string }>();
  const dispatch = useAppDispatch();
  const isPending = useSelector(isCurrentItemRequestPendingSelector);
  const item = useSelector(currentItemSelector);
  const itemError = useSelector(currentItemErrorSelector);
  const userData = useSelector(userDataSelector);

  const [isUserItem, setIsUserItem] = useState<boolean>(false);

  useEffect(() => {
    if (item?.user && userData?.username) {
      setIsUserItem(userData.username === item.user);
    }
  }, [item, userData]);

  useEffect(() => {
    dispatch(Operations.getItem(parseInt(itemId)));
  }, [itemId, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(ItemActions.reset());
    };
  }, [dispatch]);

  if (isPending)
    return (
      <h4 className={`uk-position-center uk-margin-remove uk-text-muted`}>
        Загрузка...
      </h4>
    );

  if (itemError)
    return (
      <h4 className={`uk-position-center uk-margin-remove uk-text-muted`}>
        {itemError.message}
      </h4>
    );

  if (!item) {
    return (
      <h4 className={`uk-position-center uk-margin-remove uk-text-muted`}>
        Загрузка...
      </h4>
    );
  }

  return (
    <div className={`uk-flex uk-flex-center uk-flex-wrap uk-padding-small`}>
      <div className={`uk-flex uk-flex-column uk-width-1-1 uk-width-xlarge@s`}>
        <PhotosSlideshow item={item} />
      </div>
      <div className={`uk-flex uk-flex-column uk-width-xlarge`}>
        <div className={`uk-card uk-card-body uk-card-default`}>
          <h1 className={`TextEllipsis uk-card-title`}>{item.name}</h1>
          <p className={`TextEllipsis`}>{item.description}</p>
          <div className={`uk-flex uk-flex-wrap`} uk-margin={``}>
            <div className={`uk-width-1-1 uk-width-1-2@m`}>
              <div className={`uk-flex uk-flex-middle`}>
                <span>Где: </span>
                <span className={`uk-margin-small-left`}>{item.geo}</span>
              </div>
              <div className={`uk-flex uk-flex-middle`}>
                <span>Категория: </span>
                <span className={`uk-margin-small-left`}>{item.item_category.name}</span>
              </div>
              <div className={`uk-flex uk-flex-middle`}>
                <span>Хочу: </span>
                <span className={`uk-margin-small-left`}>{item.trade_category.name}</span>
              </div>
            </div>
          </div>
        </div>
        <div className={`ItemActions uk-flex uk-flex-wrap`} uk-margin={``}>
          <AddToCart item={item} />
          <button type={`button`} className={`uk-button uk-button-default`}
                  onClick={() => {
                    if (history.length > 1) {
                      history.goBack();
                    } else {
                      history.push(`/items/${item?.id}`);
                    }
                  }}>
            Назад
          </button>
          {(isUserItem) ? (
            <>
              <Link
                className={`uk-button uk-button-default`}
                to={`/items/${itemId}/edit`}>
                Редактировать
              </Link>
              <button className={`uk-button uk-button-danger`}
                      onClick={() => {
                        dispatch(Operations.deleteItem(parseInt(itemId)));
                        dispatch(ItemActions.reset());
                        history.goBack();
                      }}>
                Удалить
              </button>
            </>
          ) : null}
        </div>

      </div>
    </div>
  );
};