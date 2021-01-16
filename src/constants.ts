export const rootContants = {
  isProduction: process.env.NODE_ENV === 'production',
};

export const ErrorMap = {
  RECAPTCHA_RESPONSE_KEY_INVALID: {
    code: 'RECAPTCHA_RESPONSE_KEY_INVALID',
    message: 'Recaptcha response key invalid',
  },
  EMAIL_OR_PASSWORD_INVALID: {
    code: 'EMAIL_OR_PASSWORD_INVALID',
    message: 'Email or password invalid',
  },
  EMAIL_EXISTED: {
    code: 'EMAIL_EXISTED',
    message: 'Email is existed',
  },
};
