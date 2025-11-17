const jwt = require('jsonwebtoken');
const { generateTokenPair } = require('../utils/token');

const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization;
  const refreshToken = req.headers['x-refresh-token'];
  
  const [prefix, authToken] = token ? token.split(' ') : [null, null];
  
  if (prefix !== 'JWT') {
    return res.status(400).json({ error: 'invalid token' });
  }
  
  if (!authToken) {
    return res.status(400).json({ error: 'token absent' });
  }
  
  jwt.verify(authToken, process.env.JWT_SECRET, (err, decode) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        if (!refreshToken) {
          return res.status(400).json({ error: 'invalid token' });
        }
        
        jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decode) => {
          if (err) {
            return res.status(400).json({ error: 'invalid token' });
          }
          
          const { accessToken, refreshToken: newRefreshToken } = generateTokenPair({
            userId: decode.userId,
            email: decode.email,
            role: decode.role
          });
          
          res.setHeader('x-access-token', accessToken);
          res.setHeader('x-refresh-token', newRefreshToken);
          req.user = decode;
          next();
        });
      } else {
        return res.status(400).json({ error: 'invalid token' });
      }
    } else {
      req.user = decode;
      next();
    }
  });
};

module.exports = verifyToken;

