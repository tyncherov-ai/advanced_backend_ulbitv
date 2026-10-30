import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { ValidationException } from '../exceptions/validation.exception';

@Injectable()
export class ValidationPipe implements PipeTransform<unknown> {
  async transform(value: unknown, metadata: ArgumentMetadata) {
    const { metatype } = metadata;
    // Nothing to validate: no type info or a primitive (string, number, ...)
    if (!metatype || this.isPrimitive(metatype)) {
      return value;
    }

    const obj = plainToInstance(metatype as ClassConstructor<object>, value);
    const errors = await validate(obj);
    if (errors.length > 0) {
      const messages = errors.map(
        (err) =>
          `${err.property} - ${Object.values(err.constraints ?? {}).join(', ')}`,
      );
      throw new ValidationException(messages);
    }

    return value;
  }

  private isPrimitive(metatype: unknown) {
    return [String, Boolean, Number, Array, Object].includes(metatype as never);
  }
}
