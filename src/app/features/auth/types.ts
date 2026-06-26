export type TAuthMe = {
  firstName: string;
  id: number;
  lastName: string;
};

export type TAuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export type TAuthLogin = TAuthTokens & TAuthMe;

export type TAuthRefresh = TAuthTokens;
