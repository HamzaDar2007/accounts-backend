import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { Country } from '../enums/country.enum';

export function IsTrnValid(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isTrnValid',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (!value) return true;
          
          const country = (args.object as any).country;
          
          switch (country) {
            case Country.UAE:
              return /^1\d{14}$/.test(value);
            case Country.KSA:
              return /^3\d{14}$/.test(value);
            case Country.EGYPT:
              return /^\d{9}$/.test(value);
            default:
              return true;
          }
        },
        defaultMessage() {
          return 'Invalid TRN format for selected country';
        },
      },
    });
  };
}