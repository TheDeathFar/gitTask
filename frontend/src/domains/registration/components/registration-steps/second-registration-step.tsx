import React, { FC, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { classValidatorResolver } from '@hookform/resolvers/class-validator';
import { RegistrationContext } from '#domains/registration/pages/registration-page/registration-page';
import { SecondStepData } from '#domains/registration/dto/second-registration-step.dto';
import { RegistrationPhotoInput } from '../registration-photo-input/registration-photo-input';
import { AppInput } from '#components/app-input/app-input';

export const SecondRegistrationStep: FC<{ next: () => void, prev: () => void }> = ({ next, prev }) => {
  const { appendToState } = useContext(RegistrationContext);
  const { register, formState: { errors }, handleSubmit } = useForm<SecondStepData>({
    resolver: classValidatorResolver(SecondStepData),
    mode: `onSubmit`,
  });

  const onSubmit = handleSubmit((data) => {
    appendToState(data);
    next();
  });


  return (
    <>
      <h1 className={`uk-card-title`}>Регистрация</h1>
      <div className={`uk-flex uk-flex-column uk-flex-middle`}>
        <form className={`uk-width-1-1`} id={`user-info-form`} onSubmit={onSubmit}>
          <AppInput
            name={`firstName`}
            inputProps={{
              placeholder: `Вася`
            }}
            options={{
              icon: `user`,
              isRequired: true
            }}
            useForm={{register, errors}}
          />

          <AppInput
            name={`phone`}
            inputProps={{
              placeholder: `8005553535`,
              type: `tel`
            }}
            options={{
              icon: `phone`,
              isRequired: true
            }}
            useForm={{register, errors}}
          />

          <AppInput
            name={`birthday`}
            inputProps={{
              placeholder: ``,
              type: `date`
            }}
            options={{
              icon: `calendar`,
              isRequired: true
            }}
            useForm={{register, errors}}
          />
        </form>

        <RegistrationPhotoInput />
      </div>
      <div className={`uk-child-width-expand uk-margin uk-margin-remove-bottom`} uk-grid={``}>
        <div>
          <button type={`button`} className={`uk-button uk-button-default uk-width-1-1`}
             onClick={prev}>
            &lt; Назад
          </button>
        </div>
        <div>
          <button form={`user-info-form`} className={`uk-button uk-button-primary uk-width-1-1`}
                  type={`submit`}>
            Далее &gt;
          </button>
        </div>
      </div>
    </>
  );
};

