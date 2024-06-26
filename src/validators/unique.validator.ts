/*import { ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, registerDecorator } from 'class-validator';
import { Injectable, Logger } from '@nestjs/common';
import { Repository, EntityTarget, Entity } from 'typeorm';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';

@Injectable()
@ValidatorConstraint({ name: 'isUnique', async: true })
export class IsUniqueConstraint<Entity> implements ValidatorConstraintInterface {
    private readonly logger = new Logger(IsUniqueConstraint.name);
    private repository: Repository<Entity>;

    constructor(@InjectRepository(Repository<Entity>) private readonly repositoryBuilder: Repository<Entity>) {};
    async validate(value: any, validationArguments?: ValidationArguments): Promise<boolean> {
        const [entityClass, field] = validationArguments.constraints as [EntityTarget<Entity>, string];
        
        try {
            this.repository = this.repository ?? this.repositoryBuilder;
            const entity = await this.repository.findOne({ where: { [field]: value } });
            return !entity;
        } catch (error) {
            this.logger.error(`Error validating uniqueness: ${error.message}`, error.stack);
            throw error;
        }
    }

    defaultMessage(validationArguments?: ValidationArguments): string {
        const [repository, field] = validationArguments.constraints as [Repository<any>, string];
        return `El campo ${field} ya se encuentra en uso`;
    }
}

export function IsUnique(entityClass: any, field: string, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [entityClass, field],
            validator: IsUniqueConstraint,
        });
    };
}*/

