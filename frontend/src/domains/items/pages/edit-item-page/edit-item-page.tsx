import React, { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { currentItemSelector, userDataSelector } from '#redux/selectors';
import { useSelector } from 'react-redux';
import { useLoadCategoriesList } from '#src/js/hooks/use-load-categories-list';
import { PhotosSlideshow } from '#domains/items/components/photos-slideshow/photos-slideshow';
import { ItemEditPhotoForm } from '#domains/items/components/item-edit-photo-form/item-edit-photo-form';
import { ItemEditForm } from '#domains/items/components/item-edit-form/item-edit-form';
import { Operations } from '#redux/operations/operations';
import { useAppDispatch } from '#redux/store';
import { ItemActions } from '#redux/reducers/slices/item-slice';

export const EditItemPage: FC = () => {
  const { itemId } = useParams<{ itemId: string }>();
  const dispatch = useAppDispatch();
  const item = useSelector(currentItemSelector);
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

  useLoadCategoriesList();

  if (!item)
    return null;

  if (!isUserItem)
    return (
      <div className={`uk-flex uk-flex-center uk-flex-wrap uk-padding-small`}>
        Это не ваша вещь
      </div>
    );

  return (
    <div className={`uk-flex uk-flex-center uk-flex-wrap uk-padding-small`}>
      <div className={`uk-flex uk-flex-column uk-flex-middle uk-width-1-1 uk-width-xlarge@m`}>
        <PhotosSlideshow item={item} />
        <div className={`uk-margin-bottom uk-flex uk-flex-column`}>
          <ItemEditPhotoForm item={item} />
        </div>
      </div>

      <div className={`uk-card uk-card-body uk-card-default uk-width-xlarge`}>
        <h1 className={`uk-card-title`}>Редактирование</h1>
        <ItemEditForm item={item} />
      </div>
    </div>
  );
};