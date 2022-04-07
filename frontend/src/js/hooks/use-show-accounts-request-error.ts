import { useEffect } from 'react';
import UIkit from 'uikit';
import { useSelector } from 'react-redux';
import { accountsRequestErrorSelector } from '#redux/selectors';

export const useShowAccountsRequestError = (isSubmitSuccessful: boolean): void => {
  const accountsRequestError = useSelector(accountsRequestErrorSelector);

  useEffect(() => {
    if (isSubmitSuccessful && accountsRequestError)
      UIkit.notification({
        message: accountsRequestError.message,
        pos: `bottom-right`,
      });

  }, [accountsRequestError, isSubmitSuccessful]);
};