import React, { FC } from 'react';
import { TradeofferDto } from '#server/common/dto/tradeoffer.dto';
import { Link } from 'react-router-dom';
import { useAppDispatch } from '#redux/store';
import { Operations } from '#redux/operations/operations';

interface TradeProps {
  trade: TradeofferDto;
  isUserTrade: boolean;
}

export const TradeCard: FC<TradeProps> = (props) => {
  const dispatch = useAppDispatch();
  const { trade, isUserTrade = true } = props;
  const { id } = trade;
  let { offered_item, desired_item } = trade;

  if (!isUserTrade)
    offered_item = [desired_item, desired_item = offered_item][0];

  return (
    <div className={`uk-card uk-card-default uk-card-body uk-width-1-1`} data-id={id}>
      <div className={`TradeCard`}>
        <div className={`TradeCard-header`}>
          <div className={`TradeCard-info`}>
            <h1 className={`ItemCard-title uk-h4 uk-link-heading`}>
              <Link className={`uk-link`} to={`/items/${offered_item.id}`}>{offered_item.name}</Link>
              <span>-&gt;</span>
              <Link className={`uk-link`} to={`/items/${desired_item.id}`}>{desired_item.name}</Link>
            </h1>
            <div className={`TradeCard-category`}>
              <span>{offered_item.item_category.name}</span>
              <span>-&gt;</span>
              <span>{desired_item.item_category.name}</span>
            </div>

            <div className={`TradeCard-location`}>
              <span uk-icon={`icon: location; ratio: 0.75`} />
              <span>{desired_item.geo}</span>
            </div>
          </div>
        </div>
      </div>
      <div className={`uk-flex uk-flex-right`}>
        {(isUserTrade) ? (

          <button className={`uk-link`} type={`button`} onClick={() => {
            dispatch(Operations.cancelTrade(id));
          }} uk-icon={`trash`} />

        ) : (
          <>
            <button className={`uk-link uk-padding-small uk-padding-remove-vertical`} type={`button`} onClick={() => {
              dispatch(Operations.cancelTrade(id));
            }} uk-icon={`close`} />
            <button className={`uk-link uk-padding-small uk-padding-remove-vertical`} type={`button`} onClick={() => {
              dispatch(Operations.acceptTrade(id));
            }} uk-icon={`check`} />
          </>
        )}
      </div>
    </div>
  );
};