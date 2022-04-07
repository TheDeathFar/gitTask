import { useAuthorizedOnly } from '#src/js/hooks/use-authorized-only';
import { useSelector } from 'react-redux';
import { userDataSelector } from '#redux/selectors';
import { useEffect } from 'react';
import { UserRole } from '#server/common/enums/user-role.enum';
import { useHistory } from 'react-router-dom';

export const useAdminOnly = (): void => {
  const history = useHistory();
  const userData = useSelector(userDataSelector);

  useAuthorizedOnly();

  useEffect(() => {
    if (userData?.role && userData.role !== UserRole.ADMIN) {
      history.replace(`/`);
    }
  }, [userData, history]);

};