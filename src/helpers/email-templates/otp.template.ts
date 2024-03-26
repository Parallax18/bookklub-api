import { EmailOptions } from '../interfaces/mailer.interfaces';

const html = String.raw;

export const otpMail = ({ content }: EmailOptions) => {
  return html`
    <p>Hi ${content.name},</p>
    <p>Here is your OTP code</p>
    <h2>${content.OTP}</h2>
  `;
};
