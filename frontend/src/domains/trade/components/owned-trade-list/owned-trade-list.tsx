import React, { FC, useEffect, useMemo, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Operations } from '#redux/operations/operations';
import SpinnerWrapper from '#components/spinner-wrapper/spinner-wrapper';
import { useAppDispatch } from '#redux/store';
import { useSelector } from 'react-redux';
import {
  isUserOwnedTradesRequestPendingSelector,
  userOwnedTradesCurrentMetaSelector,
  userOwnedTradesListSelector,
} from '#redux/selectors';
import { PaginationRequestDto } from '#server/common/dto/pagination-request.dto';
import { CatalogueActions } from '#redux/reducers/slices/catalogue-slice';
import { TradeCard } from '#domains/trade/components/trade-card/trade-card';
import { useShowTradeRequestError } from '#src/js/hooks/use-show-trade-request-error';

export const OwnedTradeList: FC = () => {
  const [isDispatched, setIsDispatched] = useState<boolean>(false);
  const [isEmpty, setIsEmpty] = useState<boolean>(true);
  const dispatch = useAppDispatch();
  const tradesList = useSelector(userOwnedTradesListSelector);
  const currentMeta = useSelector(userOwnedTradesCurrentMetaSelector);
  const isPending = useSelector(isUserOwnedTradesRequestPendingSelector);
  const tradesOptions = useMemo<Partial<PaginationRequestDto>>(() => ({
    page: 1,
  }), []);

  useEffect(() => {
    if (tradesList.length === 0) {
      dispatch(Operations.getUserOwnedTrades(tradesOptions));
      setIsDispatched(true);
    }
  }, [tradesList, setIsDispatched, dispatch, tradesOptions]);

  useEffect(() => {
    return () => {
      dispatch(CatalogueActions.reset());
    };
  }, [dispatch]);

  useEffect(() => {
    setIsEmpty(!isPending && isDispatched && tradesList?.length === 0);
  }, [isPending, isDispatched, tradesList]);

  useShowTradeRequestError(isDispatched);

  if (!tradesList)
    return null;

  return (
    <div className={`uk-flex uk-flex-column uk-width-1-1 uk-height-1-1`}>
      <h3 className={`uk-text-muted uk-text-center uk-margin-top`}>Вы предложили</h3>
      <div id={`scrollable-target_owned`}
           className={`WithScrollbar uk-overflow-auto uk-child-width-1-1`}>
        <InfiniteScroll
          next={() => {
            dispatch(Operations.getUserOwnedTrades({
              ...tradesOptions,
              page: currentMeta?.currentPage + 1,
            }));
          }}
          hasMore={currentMeta?.currentPage < currentMeta?.totalPages}
          loader={null}
          dataLength={tradesList.length}
          scrollableTarget={`scrollable-target_owned`}
        >
          <div className={`uk-flex uk-flex-left uk-width-1-1 uk-flex-wrap`}>
            {(isEmpty) ? (
              <div className={`uk-flex uk-flex-center uk-width-1-1`}>
                Тут пока ничего нет
              </div>
            ) : null}
            {tradesList?.map((trade) => (
              <div key={trade.id} className={`uk-width-1-1 uk-padding-small`}>
                <TradeCard trade={trade} isUserTrade={true} />
              </div>
            )) ?? null}
            <div className={`uk-position-relative uk-height-small uk-width-1-1 ${(!isPending) ? `uk-hidden` : ``}`}>
              <SpinnerWrapper loading={true} />
            </div>
          </div>
        </InfiniteScroll>
      </div>
    </div>
  );
};