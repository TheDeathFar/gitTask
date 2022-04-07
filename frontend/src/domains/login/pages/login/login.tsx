import React, { FC } from 'react';
import { useForm } from 'react-hook-form';
import { classValidatorResolver } from '@hookform/resolvers/class-validator';
import { useAppDispatch } from '#redux/store';
import { Operations } from '#redux/operations/operations';
import { isUserRequestPendingSelector } from '#redux/selectors';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { LoginUserDto } from '#server/common/dto/login-user.dto';
import { useShowUserRequestError } from '#src/js/hooks/use-show-user-request-error';
import { AppInput } from '#components/app-input/app-input';

const Login: FC = () => {
  const dispatch = useAppDispatch();
  const isPending = useSelector(isUserRequestPendingSelector);

  const { register, handleSubmit, formState: { errors, isSubmitSuccessful } } = useForm<LoginUserDto>({
    resolver: classValidatorResolver(LoginUserDto),
  });

  const onSubmit = handleSubmit((data) => {
    dispatch(Operations.login(data));
  });

  useShowUserRequestError(isSubmitSuccessful);

  return (
    <div className={`uk-flex uk-flex-column uk-flex-center uk-flex-middle uk-width-1-1 uk-height-1-1`}>
      <form onSubmit={onSubmit} className={`uk-card uk-card-default uk-card-body`}>
        <h1 className={`uk-card-title`}>Вход</h1>
        <div className={`uk-flex uk-flex-column uk-flex-middle`} uk-margin={``}>
          <AppInput
            name={`username`}
            inputProps={{
              placeholder: `Логин`,
            }}
            options={{
              icon: `user`,
              withLabel: false,
            }}
            useForm={{ register, errors }}
          />

          <AppInput
            name={`password`}
            inputProps={{
              placeholder: `12345678`,
              type: `password`,
            }}
            options={{
              icon: `lock`,
              withLabel: false,
            }}
            useForm={{ register, errors }}
          />

        </div>
        <button disabled={isPending}
                className={`uk-button uk-button-primary uk-width-1-1 uk-margin uk-margin-remove-bottom`}
                type={`submit`}>Войти
        </button>
      </form>
      <div className={`uk-text-small uk-text-center uk-width-1-1`}>
        <Link className={`uk-display-inline-block uk-link uk-padding-small`} to={`/registration`}>У меня нет
          аккаунта</Link>
      </div>
    </div>
  );
};

export default Login;