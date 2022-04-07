import { useEffect } from 'react';
import UIkit from 'uikit';
import { useSelector } from 'react-redux';
import { categoriesRequestErrorSelector } from '#redux/selectors';

export const useShowCategoriesRequestError = (isSubmitSuccessful: boolean): void => {
  const categoriesRequestError = useSelector(categoriesRequestErrorSelector);

  useEffect(() => {
    if (isSubmitSuccessful && categoriesRequestError)
      UIkit.notification({
        message: categoriesRequestError.message,
        pos: `bottom-right`,
      });

  }, [categoriesRequestError, isSubmitSuccessful]);
};