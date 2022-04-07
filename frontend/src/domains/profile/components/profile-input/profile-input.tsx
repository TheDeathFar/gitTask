import { EditProfileDto } from '#server/common/dto/edit-profile.dto';
import React from 'react';
import { FieldErrors, FieldPath } from 'react-hook-form';
import InputHint from '#components/input-hint/input-hint';
import { keyToLabelText } from '#src/js/util/key-to-label-text';

interface ProfileInputPropsInterface<T> {
  name: FieldPath<EditProfileDto> | `passwordConfirmation`,
  type?: string,
  placeholder: string,
  register: (...rest: any) => any,
  errors: FieldErrors<T>,
}

export const ProfileInput = <T extends unknown>(props: ProfileInputPropsInterface<T>): JSX.Element => {
  const {
    name,
    type = `text`,
    placeholder,
    register,
    errors,
  } = props;

  return (
    <div className={`uk-margin-small uk-margin-remove-top uk-flex uk-flex-middle uk-flex-wrap`}>
      <div>
        <label className={`uk-margin-right`}>{keyToLabelText.get(name)}:</label>
      </div>
      <div className={`uk-width-1-1 uk-width-expand@s uk-flex uk-flex-left`}>
        <div className={`uk-position-relative uk-width-1-1`}>
          <input
            type={type}
            className={`uk-width-1-1 uk-input ${(errors[name]) ? `uk-form-danger` : `uk-form-blank`}`}
            placeholder={placeholder}
            {...register(name)}
          />
          <InputHint
            text={errors[name]?.message}
            className={`uk-position-center-right-out`}
            isActive={!!errors[name]}
          />
        </div>
      </div>
    </div>
  );
};