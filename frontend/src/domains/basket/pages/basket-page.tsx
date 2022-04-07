import React, { FC, useEffect } from 'react';
import {
  basketDesiredLengthSelector,
  basketDesiredSelector,
  basketOfferedLengthSelector,
  basketOfferedSelector,
  isTradeRequestPendingSelector,
  tradeRequestErrorSelector,
  tradeRequestResultSelector,
} from '#redux/selectors';
import { useSelector } from 'react-redux';
import { BasketContentRadios } from '#domains/basket/components/basket-content-radios/basket-content-radios';
import { useForm } from 'react-hook-form';
import { CreateTradeofferDto } from '#server/common/dto/create-tradeoffer.dto';
import { classValidatorResolver } from '@hookform/resolvers/class-validator';
import { useAppDispatch } from '#redux/store';
import { Operations } from '#redux/operations/operations';
import { useShowTradeRequestError } from '#src/js/hooks/use-show-trade-request-error';
import { TradeActions } from '#redux/reducers/slices/trade-slice';
import { BasketActions } from '#redux/reducers/slices/basket-slice';
import { useHistory } from 'react-router-dom';

export const BasketPage: FC = () => {
  const dispatch = useAppDispatch();
  const history = useHistory();
  const offered = useSelector(basketOfferedSelector);
  const offeredLength = useSelector(basketOfferedLengthSelector);
  const desired = useSelector(basketDesiredSelector);
  const desiredLength = useSelector(basketDesiredLengthSelector);
  const isPending = useSelector(isTradeRequestPendingSelector);
  const tradeError = useSelector(tradeRequestErrorSelector);
  const tradeResult = useSelector(tradeRequestResultSelector);

  const { register, handleSubmit, formState: { errors, isSubmitSuccessful, isValid } } = useForm<CreateTradeofferDto>({
    resolver: classValidatorResolver(CreateTradeofferDto),
    mode: `onChange`,
  });

  const onSubmit = handleSubmit((data) => {
    dispatch(Operations.createTrade(data));
  });

  useEffect(() => {
    dispatch(TradeActions.reset());
    // eslint-disable-next-line
  }, []);

  useShowTradeRequestError(isSubmitSuccessful);

  // Все успешно
  useEffect(() => {
    if (isSubmitSuccessful && tradeResult) {
      dispatch(BasketActions.reset());
      dispatch(TradeActions.reset());
      history.replace(`/trades`);
    }
  }, [isSubmitSuccessful, tradeResult, dispatch, history]);

  if (!offered || !desired)
    return null;

  return (
    <div className={`WithScrollbar uk-overflow-auto uk-height-1-1`}>
      <form className={`uk-padding-small uk-flex uk-flex-column uk-height-1-1`} onSubmit={onSubmit}>
        <div
          className={`WithScrollbar uk-overflow-auto uk-flex uk-flex-around uk-width-1-1 uk-flex-wrap uk-height-1-1`}>
          <div
            className={`BasketList uk-width-1-1 uk-width-1-2@m uk-flex uk-flex-column uk-flex-middle uk-flex-left uk-height-1-1`}>
            <BasketContentRadios
              name={`offered_item_id`}
              basketContent={offered}
              useForm={{ register, errors }} />
          </div>
          <div
            className={`BasketList uk-width-1-1 uk-width-1-2@m uk-flex uk-flex-column uk-flex-middle uk-flex-left uk-height-1-1`}>
            <BasketContentRadios
              name={`desired_item_id`}
              basketContent={desired}
              useForm={{ register, errors }} />
          </div>
        </div>
        <div className={`uk-width-1-1 uk-flex uk-flex-center uk-padding-small uk-padding-remove-bottom`}>
          <button disabled={isPending || !isValid} type={`submit`} className={`uk-button uk-button-primary`}>Предложить
            обмен
          </button>
        </div>
      </form>
    </div>
  );
};