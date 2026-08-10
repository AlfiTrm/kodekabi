export type AdminLoginRequest = {
  email: string;
  password: string;
};

export type AdminLoginResponse = {
  token?: string;
  access_token?: string;
  session_token?: string;
  refresh_token?: string;
  expires_in?: number;
  expires_at?: string;
  email?: string;
  requires_otp?: boolean;
  user?: {
    id?: string;
    role?: string;
  };
};

export type AdminLoginActionState = {
  error: string | null;
};

export type AdminVerifyOtpRequest = {
  code: string;
};

export type AdminVerifyOtpResponse = {
  token: string;
  refresh_token?: string;
  expires_in?: number;
  requires_otp: boolean;
};

export type AdminVerifyActionState = {
  error: string | null;
};
