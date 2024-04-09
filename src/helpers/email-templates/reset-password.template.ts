import { EmailOptions } from '../interfaces/mailer.interfaces';

const html = String.raw;
export const resetPasswordMail = ({ content }: EmailOptions) => {
  return html`
    <p>Hi ${content.name},</p>
    <p>Please use this OTP code to reset your password</p>
    <h2>${content.OTP}</h2>
  `;
};
