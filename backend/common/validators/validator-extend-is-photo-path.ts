import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { isPhotoFilename } from '#server/common/util/is-photo-filename';

export const IsPhotoPath = <T>(validationOptions?: ValidationOptions) => {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsPhotoPathConstraint,
    });
  };
};

@ValidatorConstraint({ name: `IsPhotoPath` })
export class IsPhotoPathConstraint implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments) {
    return isPhotoFilename(value);
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} must be image`;
  }
}
