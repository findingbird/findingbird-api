import { DomainException } from '~/common/exceptions/DomainException';

export class ValidationError extends DomainException {
  constructor(domainName: string, message: string) {
    super(domainName, message);
    this.name = 'ValidationError';
  }
}
