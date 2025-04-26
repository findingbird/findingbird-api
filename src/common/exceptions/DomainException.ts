export class DomainException extends Error {
  status: number;
  constructor(domainName: string, message: string, status: number) {
    const errorMessage = `[${domainName}] ${message}`;
    super(errorMessage);
    this.name = 'DomainException';
    this.status = status;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
