import { ValidationError, ValidatorOptions } from 'class-validator';

export interface ValidationPipeOptions extends ValidatorOptions {
  transform?: boolean;
  disableErrorMessage?: boolean;
  exceptionFactory?: (errors: ValidationError[]) => any;
}
