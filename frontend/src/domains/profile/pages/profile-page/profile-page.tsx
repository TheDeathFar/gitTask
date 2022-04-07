import React, { FC, useEffect } from 'react';
import { isUserRequestPendingSelector, userDataSelector, userPhotoUrlSelector } from '#redux/selectors';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { EditProfileDto } from '#server/common/dto/edit-profile.dto';
import { ProfileInput } from '#domains/profile/components/profile-input/profile-input';
import { useAppDispatch } from '#redux/store';
import { Operations } from '#redux/operations/operations';
import { useShowUserRequestError } from '#src/js/hooks/use-show-user-request-error';
import noPhoto from '#src/icons/no-photo.svg';
import { classValidatorResolver } from '@hookform/resolvers/class-validator';
import { ProfilePhotoForm } from '#domains/profile/components/profile-photo-form/profile-photo-form';
import { ProfilePasswordForm } from '#domains/profile/components/profile-password-form/profile-password-form';
import { ThisUserPhoto } from '#components/user-photo/this-user-photo';

export const ProfilePage: FC = () => {
  const dispatch = useAppDispatch();
  const userData = useSelector(userDataSelector);
  const isURPending = useSelector(isUserRequestPendingSelector);

  const {
    handleSubmit,
    register,
    formState: { isDirty, errors, isSubmitSuccessful },
    reset,
  } = useForm<EditProfileDto>({
    mode: `onTouched`,
    resolver: classValidatorResolver(EditProfileDto),
    defaultValues: {
      firstName: userData?.firstName,
      email: userData?.email,
      phone: userData?.phone,
      birthday: userData?.birthday,
    },
  });

  useShowUserRequestError(isSubmitSuccessful);

  useEffect(() => {
    if (userData) {
      reset({ ...userData });
    }
  }, [userData, reset]);

  const onSubmit = handleSubmit((data) => {
    dispatch(Operations.editProfile(data));
  });


  return (
    <div className={`uk-padding-small uk-flex-center`} uk-grid={``}>
      <div className={`uk-width-medium uk-width-1-3@s uk-width-1-4@m`}>
        <div className={`uk-card uk-card-default uk-card-body`}>
          <ThisUserPhoto className={`uk-width-1-1`} />
        </div>
        <div className={`uk-margin-top`} uk-margin={``}>
          <ProfilePhotoForm />
          <ProfilePasswordForm />
        </div>
      </div>
      <div className={`uk-width-1-1 uk-width-2-3@s uk-width-1-2@m`}>
        <div className={`uk-card uk-card-default uk-card-body`}>
          <h2>{userData?.username}</h2>
          <form
            onSubmit={onSubmit}
            className={`uk-flex-middle`}
          >
            <ProfileInput
              name={`firstName`}
              placeholder={`Вася`}
              register={register}
              errors={errors} />

            <ProfileInput
              name={`email`}
              type={`email`}
              placeholder={`your@gmail.com`}
              register={register}
              errors={errors} />

            <ProfileInput
              name={`phone`}
              type={`tel`}
              placeholder={`8005553535`}
              register={register}
              errors={errors} />

            <ProfileInput
              name={`birthday`}
              type={`date`}
              placeholder={``}
              register={register}
              errors={errors} />


            {(isDirty) ? (
              <div className={`uk-margin-top`}>
                <div className={`uk-flex uk-flex-right`}>
                  <button type={`button`} className={`uk-button uk-button-default`}
                          onClick={() => reset({ ...userData })}>
                    Отменить
                  </button>
                  <button className={`uk-button uk-button-primary uk-margin-left`}
                          type={`submit`}
                          disabled={!isDirty || isURPending}
                  >
                    Сохранить
                  </button>
                </div>
              </div>
            ) : null}
          </form>
        </div>

        {(!isDirty) ? (
          <div className={`NoSelect uk-text-muted uk-margin-top uk-text-center`}>
            Нажмите на любое поле для редактирования
          </div>
        ) : null}
      </div>
    </div>
  );
};