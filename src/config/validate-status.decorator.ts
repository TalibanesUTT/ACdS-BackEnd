import { registerDecorator, ValidationOptions, ValidationArguments } from "class-validator";

export function ValidateStatus(validationOptions?: ValidationOptions) {
    return function(object: Object, propertyName: string) {
        registerDecorator({
            name: "validateStatus",
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    const obj = args.object as any;
                    const booleans = [obj.rollback, obj.cancel, obj.onHold, obj.reject];
                    const trueCount = booleans.filter(Boolean).length;
                    return trueCount <= 1;
                },
            }
        })
    }
}