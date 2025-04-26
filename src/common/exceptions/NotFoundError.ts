import { HttpStatus } from '@nestjs/common';

import { DomainException } from '~/common/exceptions/DomainException';

export class NotFoundError extends DomainException {
  constructor(domainName: string, id?: string) {
    const message = id ? `${domainName} with id ${id} not found` : `${domainName} not found`;
    super(domainName, message, HttpStatus.NOT_FOUND);
    this.name = 'NotFoundError';
  }
}
