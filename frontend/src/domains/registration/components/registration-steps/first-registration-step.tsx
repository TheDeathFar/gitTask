import React, { FC, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { classValidatorResolver } from '@hookform/resolvers/class-validator';
import { RegistrationContext } from '#domains/registration/pages/registration-page/registration-page';
import { FirstStepData } from '#domains/registration/dto/first-registration-step.dto';
import { AppInput } from '#components/app-input/app-input';

export const FirstRegistrationStep: FC<{ next: () => void }> = ({ next }) => {
  const { appendToState } = useContext(RegistrationContext);
  const { register, formState: { errors }, handleSubmit } = useForm<FirstStepData>({
    resolver: classValidatorResolver(FirstStepData),
    mode: `onSubmit`,
  });

  const onSubmit = handleSubmit((data) => {
    appendToState(data);
    next();
  });

  return (
    <form onSubmit={onSubmit}>
      <h1 className={`uk-card-title`}>Регистрация</h1>
      <div className={`uk-flex uk-flex-column uk-flex-middle`}>
        <AppInput
          name={`username`}
          inputProps={{
            placeholder: `bradeazy`
          }}
          options={{
            icon: `user`,
            isRequired: true
          }}
          useForm={{register, errors}}/>

        <AppInput
          name={`email`}
          inputProps={{
            placeholder: `your@gmail.com`
          }}
          options={{
            icon: `mail`,
            isRequired: true
          }}
          useForm={{register, errors}}/>

        <AppInput
          name={`password`}
          inputProps={{
            placeholder: `12345678`,
            type: `password`
          }}
          options={{
            icon: `lock`,
            isRequired: true
          }}
          useForm={{register, errors}}/>

        <AppInput
          name={`passwordConfirmation`}
          inputProps={{
            placeholder: `12345678`,
            type: `password`
          }}
          options={{
            icon: `lock`,
            isRequired: true
          }}
          useForm={{register, errors}}/>
      </div>
      <div className={`uk-child-width-expand uk-margin uk-margin-remove-bottom`} uk-grid={``}>
        <div>
          <button className={`uk-button uk-button-primary uk-width-1-1`}
                  type={`submit`}>
            Далее &gt;
          </button>
        </div>
      </div>

    </form>
  );
};

