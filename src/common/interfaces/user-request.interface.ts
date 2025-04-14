import { CookieRequest } from '~/common/interfaces/cookie-request.interface';
import { JwtPayload } from '~/modules/auth/application/interfaces/jwt-payload.interface';

export interface UserRequest extends CookieRequest {
  user: JwtPayload;
}
