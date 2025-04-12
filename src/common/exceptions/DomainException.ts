export class DomainException extends Error {
  constructor(domainName: string, message: string) {
    const errorMessage = `[${domainName}] ${message}`;
    super(errorMessage);
    this.name = 'DomainException';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
