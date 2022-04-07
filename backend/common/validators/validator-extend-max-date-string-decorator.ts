import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

export const MaxDateString = <T>(
  maxDate: Date,
  validationOptions?: ValidationOptions,
) => {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [maxDate],
      validator: MaxDateStringConstraint,
    });
  };
};

@ValidatorConstraint({ name: `MaxDateString` })
export class MaxDateStringConstraint implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments) {
    const [maxDate]: Date[] = args.constraints;
    let valueDate: Date;
    try {
      valueDate = new Date(value);
    } catch (e) {
      return false;
    }

    return valueDate.getTime() <= maxDate.getTime();
  }

  defaultMessage(args: ValidationArguments) {
    const [constraintProperty]: Date[] = args.constraints;
    return `${args.property} must not be bigger than ${constraintProperty}`;
  }
}
