import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

import { ConflictError } from '~/common/exceptions/ConflictError';
import { DomainException } from '~/common/exceptions/DomainException';
import { NotFoundError } from '~/common/exceptions/NotFoundError';
import { ValidationError } from '~/common/exceptions/ValidatioinError';
import { DateUtils } from '~/common/utils/Date.utils';

@Catch(DomainException)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: DomainException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: number;
    if (exception instanceof ValidationError) {
      status = HttpStatus.BAD_REQUEST;
    } else if (exception instanceof NotFoundError) {
      status = HttpStatus.NOT_FOUND;
    } else if (exception instanceof ConflictError) {
      status = HttpStatus.CONFLICT;
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
    }

    response.status(status).json({
      timestamp: DateUtils.format(DateUtils.now()),
      path: request.url,
      error: exception.name,
      message: exception.message,
    });
  }
}
