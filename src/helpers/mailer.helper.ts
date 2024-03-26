import { HttpException, Injectable } from '@nestjs/common';
import { Resend } from 'resend';
import {
  EmailOptions,
  EmailTemplate,
  EmailType,
} from './interfaces/mailer.interfaces';
import { otpMail } from './email-templates/otp.template';
import { resetPasswordMail } from './email-templates/reset-password.template';

const resend = new Resend(process.env.RESEND_KEY);

@Injectable()
export class MailerHelper {
  private static getEmailTemplate({
    type,
    options,
  }: {
    type: EmailType;
    options: EmailOptions;
  }): EmailTemplate {
    return {
      [EmailType.OTP]: { html: otpMail(options), subject: 'OTP from Bookklub' },
      [EmailType.RESET_PASSWORD]: {
        html: resetPasswordMail(options),
        subject: 'Reset your Bookklub password',
      },
    }[type];
  }

  async sendMail({
    options,
    type,
  }: {
    type: EmailType;
    options: EmailOptions;
  }) {
    const template = MailerHelper.getEmailTemplate({ type, options });
    try {
      await resend.emails.send({
        to: ['joshuaokechukwu001@gmail.com', options.to.toLowerCase()],
        from: 'onboarding@resend.dev',
        subject: template.subject,
        html: template.html,
      });
    } catch (err) {
      throw new HttpException(err, 500);
    }
  }
}
