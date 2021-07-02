const jwtAccessSecret = process.env.SECRET_KEY_JWT_ACCESS;
const jwtRefreshSecret = process.env.SECRET_KEY_JWT_REFRESH;
const jwt = require('jsonwebtoken');

const generateAccessToken = (payload) => {
  return new Promise(
    (resolve, reject) => {
      jwt.sign(
        payload,
        jwtAccessSecret,
        {
          expiresIn: '1h'
        }, (error, token) => {
          if (error) reject(error)
          resolve(token);
        }
      );
    }
  );
};

const generateRefreshToken = (payload) => {
  return new Promise(
    (resolve, reject) => {
      jwt.sign(
        payload,
        jwtRefreshSecret,
        {
          expiresIn: '1d'
        }, (error, token) => {
          if (error) reject(error)
          resolve(token);
        }
      );
    }
  );
}

exports.generateAccessToken = generateAccessToken;