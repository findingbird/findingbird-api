import { Request } from 'express';

export interface CookieRequest extends Request {
  cookies: { [key: string]: string };
}
