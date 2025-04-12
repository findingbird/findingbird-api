import { DomainException } from '~/common/exceptions/DomainException';

export class ConflictError extends DomainException {
  constructor(domainName: string, details?: string) {
    const message = details ? `Conflict occurred for ${domainName}: ${details}` : `Conflict occurred for ${domainName}`;
    super(domainName, message);
    this.name = 'ConflictError';
  }
}
