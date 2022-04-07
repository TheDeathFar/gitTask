import React, { createContext, FC, useState } from 'react';
import { Link } from 'react-router-dom';
import { Wizard, WizardActionOverrideData } from '#components/wizard/wizard';
import { CreateUserDto } from '#server/common/dto/create-user.dto';
import { FirstRegistrationStep } from '../../components/registration-steps/first-registration-step';
import { SecondRegistrationStep } from '../../components/registration-steps/second-registration-step';
import { ThirdRegistrationStep } from '#domains/registration/components/registration-steps/third-registration-step';
import { WizardStep } from '#components/wizard/wizard-step/wizard-step';

export const RegistrationContext = createContext<{
  registrationState: Partial<CreateUserDto>;
  appendToState: (data: Partial<CreateUserDto>) => void;
  photo: File;
  setPhoto: (file: File) => void
}>(null);

const RegistrationPage: FC = () => {
  const [registrationState, setRegistrationState] = useState<Partial<CreateUserDto>>({});
  const [photo, setPhoto] = useState<File>(null);
  const [progress, setProgress] = useState<number>(0);
  const [maxProgress, setMaxProgress] = useState<number>(3);

  const updateProgressFromWizard = (data: WizardActionOverrideData) => {
    setProgress(data.newContext.step);
    setMaxProgress(data.newContext.length);
  };

  const appendToState = (data: Partial<CreateUserDto>) =>
    setRegistrationState({ ...registrationState, ...data });

  return (
    <RegistrationContext.Provider value={{ registrationState, appendToState, photo, setPhoto }}>
      <div className={`uk-flex uk-flex-column uk-margin-auto-vertical uk-flex-middle uk-width-1-1`}>
        <h4 className={`uk-margin-remove`}>
          {Math.min(progress + 1, maxProgress)} / {maxProgress}
        </h4>
        <progress className={`uk-progress  uk-width-5-6 uk-width-1-2@m`} value={progress} max={maxProgress} />
        <div className={`uk-card uk-card-default uk-card-body uk-width-5-6 uk-width-1-2@m`}>
          <Wizard
            overrideNext={(next, data) => {
              updateProgressFromWizard(data);
              next();
            }}
            overridePrev={(prev, data) => {
              updateProgressFromWizard(data);
              prev();
            }}
            // Чтобы пользователю не вводить все повторно при переходе назад
            softHide={true}
          >
            <WizardStep render={({ next }) => (
              <FirstRegistrationStep next={next} />
            )} />
            <WizardStep render={({ next, prev }) => (
              <SecondRegistrationStep next={next} prev={prev} />
            )} />
            <WizardStep render={({ prev }) => (
              <ThirdRegistrationStep prev={prev} />
            )} />
            <WizardStep render={({ next, prev }) => (
              <>
                <h1 className={`uk-card-title`}>Поздравляю</h1>
                <button onClick={next}>Вперед</button>
                <button onClick={prev}>Назад</button>
              </>
            )} />
          </Wizard>
        </div>
        <div className={`uk-text-small uk-text-center uk-width-1-1`}>
          <Link className={`uk-display-inline-block uk-link uk-padding-small`} to={`/login`}>У меня есть аккаунт</Link>
        </div>
      </div>
    </RegistrationContext.Provider>
  );
};

export default RegistrationPage;
