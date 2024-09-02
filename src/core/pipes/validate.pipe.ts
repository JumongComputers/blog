import { Injectable, ArgumentMetadata, BadRequestException, ValidationPipe, UnprocessableEntityException } from '@nestjs/common';
import { ValidationError } from 'class-validator';

@Injectable()
export class ValidateInputPipe extends ValidationPipe {
  public async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
    try {
      return await super.transform(value, metadata);
    } catch (e) {
      if (e instanceof BadRequestException) {
        // Extract validation errors from the BadRequestException
        const exceptionResponse = e.getResponse() as { message: string | ValidationError[] };
        const errors = Array.isArray(exceptionResponse.message) ? exceptionResponse.message : [];

        throw new UnprocessableEntityException(this.handleError(errors));
      }
      // Re-throw unexpected errors
      throw e;
    }
  }

  private handleError(errors: ValidationError[]): any {
    // Map the errors to a more readable format
    return errors.map(error => error.constraints);
  }
}
