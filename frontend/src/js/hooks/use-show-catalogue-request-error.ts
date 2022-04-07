import { useEffect } from 'react';
import UIkit from 'uikit';
import { useSelector } from 'react-redux';
import { catalogueRequestErrorSelector } from '#redux/selectors';

export const useShowCatalogueRequestError = (isSubmitSuccessful: boolean): void => {
  const catalogueRequestError = useSelector(catalogueRequestErrorSelector);

  useEffect(() => {
    if (isSubmitSuccessful && catalogueRequestError)
      UIkit.notification({
        message: catalogueRequestError.message,
        pos: `bottom-right`,
      });

  }, [catalogueRequestError, isSubmitSuccessful]);
};