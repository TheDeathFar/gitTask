import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import axiosInstance from '#src/js/axios/axios-instance';


export const IsEmailAvailable = <T>(validationOptions?: ValidationOptions) => {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsEmailAvailableConstraint,
    });
  };
};

@ValidatorConstraint({ name: `IsEmailAvailable` })
export class IsEmailAvailableConstraint implements ValidatorConstraintInterface {
  validate(email: string, args: ValidationArguments) {
    if (email.length === 0)
      return Promise.resolve(true);

    return (async () => {
      try {
        const res = await axiosInstance.get(`/user/is_email_already_exist/${email}`);
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
