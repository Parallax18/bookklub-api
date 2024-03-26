// eslint-disable-next-line @typescript-eslint/no-var-requires
// const otpGenerator = require('otp-generator');

import * as OtpGenerator from 'otp-generator';

export class OTPHelper {
  generateOtp() {
    const OTP = OtpGenerator.generate(6, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
      digits: true,
    });

    return OTP;
  }
}
