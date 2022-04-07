import React, { FC, useEffect, useMemo, useState } from 'react';
import { ItemCard } from '#domains/items/components/item-card/item-card';
import { useSelector } from 'react-redux';
import { isItemsRequestPendingSelector, itemsCurrentMetaSelector, itemsListSelector } from '#redux/selectors';
import { useShowItemsRequestError } from '#src/js/hooks/use-show-items-request-error';
import { useAppDispatch } from '#redux/store';
import { Operations } from '#redux/operations/operations';
import { PaginationRequestDto } from '#server/common/dto/pagination-request.dto';
import { UserItemsActions } from '#redux/reducers/slices/user-items-slice';
import InfiniteScroll from 'react-infinite-scroll-component';

export const ItemsList: FC = () => {
  const [isDispatched, setIsDispatched] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const isPending = useSelector(isItemsRequestPendingSelector);
  const itemsList = useSelector(itemsListSelector);
  const currentMeta = useSelector(itemsCurrentMetaSelector);

  const itemsOptions = useMemo<Partial<PaginationRequestDto>>(() => ({
    page: 1,
    orderDirection: `DESC`
  }), []);

  useEffect(() => {
    if (itemsList.length === 0) {
      dispatch(Operations.getUserItemsList(itemsOptions));
      setIsDispatched(true);
    }
  }, [itemsList, setIsDispatched, dispatch, itemsOptions]);

  useEffect(() => {
    return () => {
      dispatch(UserItemsActions.reset());
    };
  }, [dispatch]);

  useShowItemsRequestError(true);

  if (!itemsList)
    return null;

  if (!isPending && isDispatched && itemsList?.length === 0) {
    return (
      <div className={`uk-width-1-1 uk-flex uk-flex-center uk-flex-middle uk-text-center uk-padding-small`}>
        <h2 className={`uk-text-muted`}>Здесь будет список ваших вещей</h2>
      </div>
    );
  }

  return (
    <div id={`scrollable-target`}
         className={`ItemsContainer WithScrollbar uk-overflow-auto uk-child-width-1-1`}>
      <InfiniteScroll
        next={() => {
          dispatch(Operations.getUserItemsList({
            ...itemsOptions,
            page: currentMeta?.currentPage + 1,
          }));
        }}
        hasMore={currentMeta?.currentPage < currentMeta?.totalPages}
        loader={null}
        dataLength={itemsList.length}
        scrollableTarget={`scrollable-target`}
      >
        <div className={`uk-flex uk-flex-center uk-width-1-1 uk-flex-wrap`}>
          {itemsList?.map((item) => (
            <div key={item.id} className={`uk-width-1-1 uk-width-1-2@m uk-padding-small`}>
              <ItemCard item={item} isUserItem={true} />
            </div>
          )) ?? null}
        </div>
      </InfiniteScroll>
    </div>
  );
};