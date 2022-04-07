import React, { FC } from 'react';
import { OwnedTradeList } from '#domains/trade/components/owned-trade-list/owned-trade-list';
import { IncomingTradeList } from '#domains/trade/components/incoming-trade-list/incoming-trade-list';

export const TradesPage: FC = () => {
  return (
    <div className={`WithScrollbar uk-overflow-auto uk-height-1-1`}>
      <div className={`WithScrollbar uk-overflow-auto uk-flex uk-flex-around uk-width-1-1 uk-flex-wrap uk-height-1-1`}>
        <div className={`TradeList uk-width-1-1 uk-width-1-2@m uk-flex uk-flex-column uk-flex-middle uk-flex-left uk-height-1-1`}>
          <OwnedTradeList />
        </div>

        <div className={`TradeList uk-width-1-1 uk-width-1-2@m uk-flex uk-flex-column uk-flex-middle uk-flex-left uk-height-1-1`}>
          <IncomingTradeList />
        </div>
      </div>
    </div>
  );
};