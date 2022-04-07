import React from 'react';
import { AvailableTranslations, keyToLabelText } from '#src/js/util/key-to-label-text';
import InputHint from '#components/input-hint/input-hint';
import { UseFormFunctions } from '#components/app-input/interfaces/use-form-functions';

interface AppInputOptions {
  icon?: string,
  isRequired?: boolean,
  withLabel?: boolean,
  hintPosition?: `top-left` | `top-center` | `top-right` |
    `center-left` | `center` | `center-right`
    | `botton-left` | `botton-center` | `botton-right`;
}

interface AppInputPropsInterface {
  name: AvailableTranslations,
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>
  options?: AppInputOptions,
  useForm: UseFormFunctions
}

export const AppInput = (props: AppInputPropsInterface): JSX.Element => {
  const {
    name,
    inputProps: {
      className,
      ...restInputProps
    } = {},
    options: {
      icon,
      isRequired = false,
      withLabel = true,
      hintPosition = `center-right`,
    } = {},
    useForm: {
      register,
      errors,
    },
  } = props;
  return (
    <div className={`uk-inline uk-width-expand uk-margin-small uk-margin-remove-top`}>
      {(withLabel) ? (
        <div className='uk-flex uk-form-label'>
          <span>{keyToLabelText.get(name) ?? `unknown`}</span>
          {(isRequired) ? <span className={`RedAsterisk`}>*</span> : null}
        </div>
      ) : null}
      <div className={`uk-position-relative`}>
        {(icon) ? (
          <span className={`uk-form-icon`} uk-icon={`icon: ${icon}`} />
        ) : null}
        <input
          className={`uk-input${(errors[name]) ? ` uk-form-danger` : ``} ${className}`}
          {...restInputProps}
          {...register(name)}
        />
        <InputHint
          text={errors[name]?.message}
          className={`uk-position-${hintPosition}-out`}
          isActive={!!errors[name]}
        />
      </div>
    </div>
  );
};