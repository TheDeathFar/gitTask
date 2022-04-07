import React, { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAppDispatch } from '#redux/store';
import { Operations } from '#redux/operations/operations';
import { useShowUserRequestError } from '#src/js/hooks/use-show-user-request-error';
import { isUserRequestPendingSelector, userDataSelector } from '#redux/selectors';
import { useSelector } from 'react-redux';
import { classValidatorResolver } from '@hookform/resolvers/class-validator';
import { ChangePasswordDto } from '#server/common/dto/change-password.dto';
import { AppInput } from '#components/app-input/app-input';
import { keyToLabelText } from '#src/js/util/key-to-label-text';

export const ProfilePasswordForm: FC = () => {
  const dispatch = useAppDispatch();
  const userData = useSelector(userDataSelector);
  const isPending = useSelector(isUserRequestPendingSelector);

  const { register, handleSubmit, formState: { errors, isSubmitSuccessful } } = useForm<ChangePasswordDto>({
    resolver: classValidatorResolver(ChangePasswordDto),
  });
  const [isOpened, setIsOpened] = useState(false);

  const onSubmit = handleSubmit((data) => {
    dispatch(Operations.changePassword(data));
  });

  useShowUserRequestError(isSubmitSuccessful);

  useEffect(() => {
    if (userData) {
      setIsOpened(false);
    }
  }, [userData]);

  if (!isOpened) {
    return (
      <button className={`uk-width-1-1 uk-button uk-button-default`}
              onClick={() => setIsOpened(true)}>Изменить пароль
      </button>
    );
  }

  return (
    <form onSubmit={onSubmit}>
      <div className={`uk-inline uk-width-expand `}>
        <div className={`uk-position-relative uk-flex uk-flex-column`}>
          <AppInput
            name={`oldPassword`}
            inputProps={{
              type: `password`,
              placeholder: keyToLabelText.get(`oldPassword`),
            }}
            options={{
              withLabel: false,
              icon: `unlock`,
            }}
            useForm={{ register, errors }}
          />

          <AppInput
            name={`newPassword`}
            inputProps={{
              type: `password`,
              placeholder: keyToLabelText.get(`newPassword`),
            }}
            options={{
              withLabel: false,
              icon: `lock`,
            }}
            useForm={{ register, errors }}
          />

          <AppInput
            name={`newPasswordConfirmation`}
            inputProps={{
              type: `password`,
              placeholder: keyToLabelText.get(`newPasswordConfirmation`),
            }}
            options={{
              withLabel: false,
              icon: `lock`,
            }}
            useForm={{ register, errors }}
          />

          <button type={`submit`}
                  className={`uk-button uk-button-primary`}
                  disabled={isPending}>
            Сохранить
          </button>
        </div>
      </div>
    </form>
  );
};
