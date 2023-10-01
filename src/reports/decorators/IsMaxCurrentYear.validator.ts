import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsMaxCurrentYear(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isMaxCurrentYear',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any) {
          return typeof value === 'number' && value < new Date().getFullYear();
        },
      },
    });
  };
}
