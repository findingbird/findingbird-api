import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Request, Response } from 'express';

import { DomainException } from '~/common/exceptions/DomainException';
import { DateUtils } from '~/common/utils/Date.utils';

@Catch(DomainException)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: DomainException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception.status;

    response.status(status).json({
      timestamp: DateUtils.format(DateUtils.now()),
      path: request.url,
      error: exception.name,
      message: exception.message,
    });
  }
}
