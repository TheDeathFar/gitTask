import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import axiosInstance from '#src/js/axios/axios-instance';


export const IsUsernameAvailable = <T>(validationOptions?: ValidationOptions) => {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUsernameAvailableConstraint,
    });
  };
};

@ValidatorConstraint({ name: `IsUsernameAvailable` })
export class IsUsernameAvailableConstraint implements ValidatorConstraintInterface {
  validate(username: string, args: ValidationArguments) {
    if (username.length === 0)
      return Promise.resolve(true);

    return (async () => {
      try {
        const res = await axiosInstance.get(`/user/is_user_already_exist/${username}`);
        return !res.data;
      } catch (e) {
        return true;
      }
    })();
  }

  defaultMessage(args: ValidationArguments) {
    return `User is already registered`;
  }
}
