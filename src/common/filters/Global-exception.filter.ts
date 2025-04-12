import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

import { DomainException } from '~/common/exceptions/DomainException';
import { DomainExceptionFilter } from '~/common/filters/Domain-exception.filter';
import { DateUtils } from '~/common/utils/Date.utils';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly domainExceptionFilter: DomainExceptionFilter;
  constructor() {
    this.domainExceptionFilter = new DomainExceptionFilter();
  }

  catch(exception: unknown, host: ArgumentsHost): void {
    if (exception instanceof DomainException) {
      return this.domainExceptionFilter.catch(exception, host);
    }
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: number;
    let error: string;
    let message: string;
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      error = exception.getResponse() as string;
      message = exception.message;
    } else if (exception instanceof Error) {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      error = exception.name;
      message = exception.message;
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      error = 'Internal server error';
      message = 'An unexpected error occurred';
    }

    response.status(status).json({
      timestamp: DateUtils.format(DateUtils.now()),
      path: request.url,
      error,
      message,
    });
  }
}
