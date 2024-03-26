import { EmailOptions } from '../interfaces/mailer.interfaces';

const html = String.raw;
export const resetPasswordMail = ({ content }: EmailOptions) => {
  return html`
    <p>Hi ${content.name},</p>
    <p>Please use the link below to reset your password</p>
    <p>
      <a href=${content.resetPasswordUrl}>Reset Password</a>
    </p>
  `;
};
