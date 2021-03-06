import {
  ValidationErrorItem,
  ValidationError as JoiValidationError,
} from 'joi';

export class ValidationError extends Error {
  name = 'ValidationError';

  constructor(message: string, readonly details: ValidationErrorItem[]) {
    super(message);
  }

  static fromJoiError(error: JoiValidationError) {
    return new ValidationError(error.message, error.details);
  }
}
