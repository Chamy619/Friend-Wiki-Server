import jwt from 'jsonwebtoken';

const jwtMiddleware = (ctx, next) => {
  const token = ctx.cookies.get('access_token');
  if (!token) {
    return next();
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    ctx.status.user = {
      _id: decoded._id,
      email: decoded.email,
      username: decoded.username,
    };
    return next();
  } catch (e) {
    return next();
  }
};

export default jwtMiddleware;
