import { useEffect } from 'react';
import UIkit from 'uikit';
import { useSelector } from 'react-redux';
import { userRequestErrorSelector } from '#redux/selectors';

export const useShowUserRequestError = (isSubmitSuccessful: boolean): void => {
  const userRequestError = useSelector(userRequestErrorSelector);

  useEffect(() => {
    if (isSubmitSuccessful && userRequestError)
      UIkit.notification({
        message: userRequestError.message,
        pos: `bottom-right`,
      });

  }, [userRequestError, isSubmitSuccessful]);
};