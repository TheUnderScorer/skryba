import { validate } from './validate';
import { Constructor } from '../types/constructor';

export interface BaseSchemaConstructor<T extends BaseSchema<unknown>>
  extends Constructor<T> {
  validate: (payload: unknown) => T;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class BaseSchema<T> {
  static validate<T extends BaseSchema<unknown>>(
    this: { new (): T },
    payload: unknown
  ) {
    return validate(payload, this);
  }
}
