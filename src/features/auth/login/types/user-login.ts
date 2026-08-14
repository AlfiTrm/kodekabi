export type UserLoginRequest = {
  email: string;
  password: string;
};

export type UserLoginResponse = {
  token?: string;
  access_token?: string;
  expires_in?: number;
};

export type UserLoginActionState = {
  error: string | null;
};
