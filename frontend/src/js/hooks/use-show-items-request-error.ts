import { useEffect } from 'react';
import UIkit from 'uikit';
import { useSelector } from 'react-redux';
import { itemsRequestErrorSelector } from '#redux/selectors';

export const useShowItemsRequestError = (isSubmitSuccessful: boolean): void => {
  const itemsRequestError = useSelector(itemsRequestErrorSelector);

  useEffect(() => {
    if (isSubmitSuccessful && itemsRequestError)
      UIkit.notification({
        message: itemsRequestError.message,
        pos: `bottom-right`,
      });

  }, [itemsRequestError, isSubmitSuccessful]);
};