import jwt from 'jsonwebtoken';
import User from '../models/users';
import Admin from '../models/admin';

const jwtMiddleware = async (ctx, next) => {
  const token = ctx.cookies.get('access_token');
  if (!token) {
    return next();
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    ctx.state.user = {
      _id: decoded._id,
      username: decoded.username,
    };

    if (decoded.email) {
      ctx.state.user.email = decoded.email;
    }

    if (decoded.kakaoId) {
      ctx.state.user.kakaoId = decoded.kakaoId;
    }

    const now = Math.floor(Date.now() / 1000);

    // 토큰의 유효기간이 3.5일 미만일 경우 새로운 토큰 발행
    if (decoded.exp - now < 60 * 60 * 24 * 3.5) {
      let target = {};

      if (decoded.email) {
        target = User.findByUsername(decoded.username);
      } else {
        target = Admin.findByUsername(decoded.username);
      }

      const token = target.generateToken();
      ctx.cookies.set('access_token', token, {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
      });
    }
    return next();
  } catch (e) {
    return next();
  }
};

export default jwtMiddleware;
