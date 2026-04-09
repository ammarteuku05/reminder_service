import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import * as moment from 'moment-timezone';

@ValidatorConstraint({ async: false })
export class IsIANATimezoneConstraint implements ValidatorConstraintInterface {
  validate(timezone: string) {
    if (typeof timezone !== 'string') return false;
    return moment.tz.zone(timezone) != null;
  }
  defaultMessage() {
    return 'timezone must be a valid IANA timezone (e.g., America/New_York)';
  }
}

export function IsIANATimezone(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsIANATimezoneConstraint,
    });
  };
}
