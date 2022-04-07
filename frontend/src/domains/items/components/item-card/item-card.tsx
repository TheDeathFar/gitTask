import React, { FC } from 'react';
import noPhoto from '#src/icons/no-photo.svg';
import { ItemDto } from '#server/common/dto/item.dto';
import { Link } from 'react-router-dom';
import { srcFromPhotoPath } from '#src/js/util/src-from-photo-path';
import { ItemActionIcons } from '#domains/items/components/item-actions/item-action-icons';

interface ItemProps {
  item: ItemDto;
  isUserItem: boolean;
  withItemActions?: boolean;
  linkTo?: string;
}

export const ItemCard: FC<ItemProps> = (props) => {
  const { item, isUserItem = true, linkTo = `items`, withItemActions = true } = props;
  const { id, name, geo, item_category, trade_category, photos } = item;
  const photoPath = (photos?.[0]?.photoPath)
    ? srcFromPhotoPath(photos[0].photoPath)
    : noPhoto;

  return (
    <div className={`uk-card uk-card-default uk-card-body uk-width-1-1`} data-id={id}>
      <div className={`ItemCard`}>
        <div className={`ItemCard-header`}>
          <Link to={`/${linkTo}/${id}`} className={`ItemCard-picture`} style={{ backgroundImage: `url(${photoPath})` }}>
          </Link>
          <div className={`ItemCard-info`}>
            <Link className={`ItemCard-title uk-h4 uk-link-heading`} to={`/${linkTo}/${id}`}>{name}</Link>
            <div className={`ItemCard-category`}>
              <span>
                {item_category.name}
              </span>
              <span>-&gt;</span>
              <span>
                {trade_category.name}
              </span>
            </div>
            <div className={`ItemCard-meta`}>
              <span uk-icon={`icon: location; ratio: 0.75`} />
              <span>{geo}</span>
            </div>
            {(!isUserItem) ? (
              <div className={`ItemCard-meta`}>
                <span uk-icon={`icon: user; ratio: 0.75`} />
                <span>{item.user}</span>
              </div>
            ) : null }
          </div>
        </div>
      </div>
      <ItemActionIcons item={item} isUserItem={isUserItem} withItemActions={withItemActions} />
    </div>
  );
};