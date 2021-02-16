const fs = require('fs');

fs.writeFileSync('.env', '');

const ALLOWED_KEYS = [
  'NODE_ENV',
  'ENV_NAME',
  'DATABASE_URL',
  'GOOGLE_CLOUD_STORAGE_CREDENTIAL',
  'GOOGLE_CLOUD_PROJECT_ID',
  'DEFAULT_BUCKET_NAME',
  'JWT_ACCESS_TOKEN_SECRET',
  'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
  'JWT_REFRESH_TOKEN_SECRET',
  'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
  'RESET_PASSWORD_TOKEN_SECRET',
  'RESET_PASSWORD_TOKEN_EXPIRATION_TIME',
  'FACEBOOK_APP_ID',
  'FACEBOOK_APP_SECRET',
  'FACEBOOK_LOGIN_CALLBACK_URL',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'GOOGLE_LOGIN_CALLBACK_URL',
  'WEB_UI_SIGN_IN_SUCCESSFULLY_REDIRECT_URL',
  'REDIS_HOST',
  'REDIS_PORT',
  'REDIS_CACHE_TTL',
  'AWS_SES_REGION',
  'AWS_SES_ACCESS_KEY_ID',
  'AWS_SES_SECRET_ACCESS_KEY',
  'WEB_UI_RECOVERY_PASSWORD_URL',
  'GOOGLE_RECAPTCHA_V3_SECRET_KEY',
  'SENTRY_DSN',
  'ENCRYPT_PHONE_NUMBER_PASSWORD',
  'GOOGLE_CLOUD_STORAGE_HOST',
];

for (let key in process.env) {
  if (ALLOWED_KEYS.includes(key)) {
    fs.appendFileSync('.env', `${key}=${process.env[key]}\r\n`);
  }
}
