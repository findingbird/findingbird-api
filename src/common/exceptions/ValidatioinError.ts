import { HttpStatus } from '@nestjs/common';

import { DomainException } from '~/common/exceptions/DomainException';

export class ValidationError extends DomainException {
  constructor(domainName: string, message: string) {
    super(domainName, message, HttpStatus.BAD_REQUEST);
    this.name = 'ValidationError';
  }
}
