import jwt from 'jsonwebtoken';
import User from '../models/users';

const jwtMiddleware = (ctx, next) => {
  const token = ctx.cookies.get('access_token');
  if (!token) {
    return next();
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    ctx.state.user = {
      _id: decoded._id,
      email: decoded.email,
      username: decoded.username,
    };

    const now = Math.floor(Date.now() / 1000);
    // 토큰의 유효기간이 3.5일 미만일 경우 새로운 토큰 발행
    if (decoded.exp - now < 60 * 60 * 24 * 3.5) {
      const user = await User.findByEmail(decoded.email);
      const token = user.generateToken();
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
