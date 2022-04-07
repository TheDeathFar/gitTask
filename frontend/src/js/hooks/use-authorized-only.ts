import { useSelector } from 'react-redux';
import { isAuthorizedSelector } from '#redux/selectors';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

export const useAuthorizedOnly = (): void => {
  const isAuthorized = useSelector(isAuthorizedSelector);
  const history = useHistory();

  useEffect(() => {
    if (!isAuthorized) {
      history.replace(`/`);
    }
  }, [history, isAuthorized]);
};