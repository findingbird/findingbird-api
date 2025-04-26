import { HttpStatus } from '@nestjs/common';

import { DomainException } from '~/common/exceptions/DomainException';

export class BadRequestError extends DomainException {
  constructor(domainName: string, details?: string) {
    const message = details ? `Bad request for ${domainName}: ${details}` : `Bad request for ${domainName}`;
    super(domainName, message, HttpStatus.BAD_REQUEST);
    this.name = 'BadRequestError';
  }
}
