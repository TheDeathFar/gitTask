import { useEffect } from 'react';
import UIkit from 'uikit';
import { useSelector } from 'react-redux';
import { tradeRequestErrorSelector } from '#redux/selectors';

export const useShowTradeRequestError = (isSubmitSuccessful: boolean): void => {
  const tradeRequestError = useSelector(tradeRequestErrorSelector);

  useEffect(() => {
    if (isSubmitSuccessful && tradeRequestError)
      UIkit.notification({
        message: tradeRequestError.message,
        pos: `bottom-right`,
      });

  }, [tradeRequestError, isSubmitSuccessful]);
};