export enum EmailType {
  OTP,
  RESET_PASSWORD,
}

export interface EmailTemplate {
  html: string;
  subject: string;
}

export interface EmailOptions {
  from?: string;
  to: string;
  subject?: string;
  content?: {
    OTP?: string;
    resetPasswordUrl?: string;
    name?: string;
  };
}
