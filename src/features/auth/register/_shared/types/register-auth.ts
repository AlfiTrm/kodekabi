export type RegistrationStep = "email_submitted" | "email_verified" | "avatar_selected";

export type RegistrationSession = {
  email: string;
  current_step: RegistrationStep;
  avatar_id?: string;
  expires_at: string;
};

export type RegistrationStartResponse = RegistrationSession & {
  session_token?: string;
};

export type RegistrationCompleteResponse = {
  token?: string;
  access_token?: string;
  expires_in?: number;
};

export type RegistrationAvatar = {
  avatar_id: string;
  image_url: string;
  unlock_level: number;
  status: string;
  created_at: string;
  updated_at: string;
};

export type RegistrationAvatarsResponse = {
  avatars: RegistrationAvatar[] | null;
};

export type RegisterActionState = {
  error?: string;
};

