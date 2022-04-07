import React from 'react';
import { AvailableTranslations, keyToLabelText } from '#src/js/util/key-to-label-text';
import InputHint from '#components/input-hint/input-hint';
import { UseFormFunctions } from '#components/app-input/interfaces/use-form-functions';

interface AppTextareaOptions {
  isRequired?: boolean,
  withLabel?: boolean,
  hintPosition?: `top-left` | `top-center` | `top-right` |
    `center-left` | `center` | `center-right`
    | `botton-left` | `botton-center` | `botton-right`;
}

interface AppTextareaPropsInterface {
  name: AvailableTranslations,
  textareaProps?: React.TextareaHTMLAttributes<HTMLTextAreaElement>
  options?: AppTextareaOptions,
  useForm: UseFormFunctions
}

export const AppTextarea = (props: AppTextareaPropsInterface): JSX.Element => {
  const {
    name,
    textareaProps: {
      className,
      ...restTextareaProps
    } = {},
    options: {
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
        <textarea
          className={`AppTextarea uk-textarea${(errors[name]) ? ` uk-form-danger` : ``} ${className}`}
          {...restTextareaProps}
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