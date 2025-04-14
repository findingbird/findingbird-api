export class TokenDto {
  accessToken: string;
  refreshToken: string;
}

export type AccessTokenDto = Pick<TokenDto, 'accessToken'>;
export type RefreshTokenDto = Pick<TokenDto, 'refreshToken'>;
