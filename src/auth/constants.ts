import * as process from 'process';

export const jwtConstants = {
  secret: process.env.JWT_SECRET,
  expiresIn: process.env.JWT_EXPIRES_IN,
};
