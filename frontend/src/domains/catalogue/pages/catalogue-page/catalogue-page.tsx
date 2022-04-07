import React, { FC, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  catalogueCurrentMetaSelector,
  catalogueItemsSelector,
  isCatalogueRequestPendingSelector,
} from '#redux/selectors';
import { ItemCard } from '#domains/items/components/item-card/item-card';
import { useAppDispatch } from '#redux/store';
import { Operations } from '#redux/operations/operations';
import { useShowCatalogueRequestError } from '#src/js/hooks/use-show-catalogue-request-error';
import InfiniteScroll from 'react-infinite-scroll-component';
import SpinnerWrapper from '#components/spinner-wrapper/spinner-wrapper';
import { CatalogueActions } from '#redux/reducers/slices/catalogue-slice';
import { PaginationRequestDto } from '#server/common/dto/pagination-request.dto';

export const CataloguePage: FC = () => {
  const [isDispatched, setIsDispatched] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const catalogueItems = useSelector(catalogueItemsSelector);
  const currentMeta = useSelector(catalogueCurrentMetaSelector);
  const isPending = useSelector(isCatalogueRequestPendingSelector);

  const catalogueOptions = useMemo<Partial<PaginationRequestDto>>(() => ({
    page: 1,
  }), []);

  useEffect(() => {
    if (catalogueItems.length === 0) {
      dispatch(Operations.loadRecommendations(catalogueOptions));
      setIsDispatched(true);
    }
  }, [catalogueItems, setIsDispatched, dispatch, catalogueOptions]);

  useEffect(() => {
    return () => {
      dispatch(CatalogueActions.reset());
    };
  }, [dispatch]);

  useShowCatalogueRequestError(isDispatched);

  if (!catalogueItems)
    return null;

  if (!isPending && isDispatched && catalogueItems?.length === 0) {
    return (
      <div className={`uk-width-1-1 uk-flex uk-flex-center uk-flex-middle uk-text-center uk-padding-small`}>
        <h2 className={`uk-text-muted`}>Здесь будут предложенные вещи</h2>
      </div>
    );
  }

  return (
    <>
      <div id={`scrollable-target`}
           className={`WithScrollbar uk-overflow-auto uk-child-width-1-1`}>
        <InfiniteScroll
          next={() => {
            dispatch(Operations.loadRecommendations({
              ...catalogueOptions,
              page: currentMeta?.currentPage + 1,
            }));
          }}
          hasMore={currentMeta?.currentPage < currentMeta?.totalPages}
          loader={null}
          dataLength={catalogueItems.length}
          scrollableTarget={`scrollable-target`}
        >
          <div className={`uk-flex uk-flex-left uk-width-1-1 uk-flex-wrap`}>
            {catalogueItems?.map((item) => (
              <div key={item.id} className={`uk-width-1-1 uk-width-1-2@m uk-width-1-3@l uk-padding-small`}>
                <ItemCard item={item} linkTo={`catalogue/item`} isUserItem={false} />
              </div>
            )) ?? null}
            <div className={`uk-position-relative uk-height-small uk-width-1-1 ${(!isPending) ? `uk-hidden` : ``}`}>
              <SpinnerWrapper loading={true} />
            </div>
          </div>
        </InfiniteScroll>
      </div>
    </>
  );
};