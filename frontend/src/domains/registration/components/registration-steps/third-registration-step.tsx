import React, { FC, useContext, useEffect } from 'react';
import { RegistrationContext } from '#domains/registration/pages/registration-page/registration-page';
import { FieldPath, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { isUserRequestPendingSelector } from '#redux/selectors';
import { useAppDispatch } from '#redux/store';
import { Operations } from '#redux/operations/operations';
import { classValidatorResolver } from '@hookform/resolvers/class-validator';
import { CreateUserDto } from '#server/common/dto/create-user.dto';
import { keyToLabelText } from '#src/js/util/key-to-label-text';
import { useShowUserRequestError } from '#src/js/hooks/use-show-user-request-error';

export const ThirdRegistrationStep: FC<{ prev: () => void }> = ({ prev }) => {
  const dispatch = useAppDispatch();
  const isPending = useSelector(isUserRequestPendingSelector);

  const { registrationState, photo } = useContext(RegistrationContext);
  const { handleSubmit, setValue, formState: { errors, isSubmitSuccessful } } = useForm<CreateUserDto>({
    resolver: classValidatorResolver(CreateUserDto),
  });

  useEffect(() => {
    if (registrationState) {
      for (const [key, value] of Object.entries(registrationState)) {
        const fieldPathKey = key as FieldPath<CreateUserDto>;
        setValue(fieldPathKey, value);
      }
    }
  }, [registrationState, setValue]);

  useShowUserRequestError(isSubmitSuccessful);

  return (
    <form onSubmit={handleSubmit((data) => {
      dispatch(Operations.registration({ data, photo }));
    })}>
      <h1 className={`uk-card-title`}>Все верно?</h1>
      <div className={`uk-flex uk-flex-column`}>
        {Object.keys(new CreateUserDto()).map((key) => {
          return (
            <div key={key} className={`uk-margin-small uk-margin-remove-bottom`}>
              <div className={`uk-flex`}>
                <div>{keyToLabelText.get(key as FieldPath<CreateUserDto>)}:</div>
                <div className={`uk-width-expand uk-text-right`}>{(() => {
                  if (key === `password`)
                    return registrationState[key]?.replaceAll(/[^\n]/g, `*`) ?? `Не введен`;

                  if (key === `photoPath`)
                    return (photo) ? photo.name : `Не загружено`;

                  return registrationState[key] ?? `Отсутствует`;
                })()}</div>
              </div>
              {(errors[key])
                ? (
                  <span className={`uk-label-danger uk-padding-small uk-padding-remove-vertical`}>
                    {errors[key].message}
                  </span>
                )
                : null
              }
            </div>
          );
        })}
      </div>
      <div className={`uk-child-width-expand uk-margin  uk-margin-remove-bottom`} uk-grid={``}>
        <div>
          <button type={`button`} className={`uk-button uk-button-default uk-width-1-1`} onClick={prev}>
            &lt; Назад
          </button>
        </div>
        <div>
          <button className={`uk-button uk-button-primary uk-width-1-1`}
                  type={`submit`} disabled={isPending}>
            Верно
          </button>
        </div>
      </div>
    </form>
  );
};