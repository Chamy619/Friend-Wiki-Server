import Joi from 'joi';
import User from '../../models/users';

const USERNAMES = ['양채훈', '방세현', '안영민', '성준혁', '오예손', '최국주', '테스터', '테스팅'];

export const register = async (ctx) => {
  // 회원가입
  const schema = Joi.object().keys({
    email: Joi.string().min(5).required(),
    username: Joi.string().min(3).max(20).required(),
    password: Joi.string().required(),
  });

  const result = schema.validate(ctx.request.body);
  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  const { email, username, password } = ctx.request.body;
  try {
    const exists = (await User.findByEmail(email)) || (await User.findByUsername(username));
    if (exists) {
      ctx.status = 409;
      return;
    }

    // const existsUsername = await User.findByUsername(username);
    // if (existsUsername) {
    //   ctx.status = 409;
    //   return;
    // }

    // 이름 검증 후 만약 위의 이름에 포함되지 않을 경우 회원가입 거부
    if (USERNAMES.indexOf(username) === -1) {
      ctx.status = 403;
      return;
    }

    const user = new User({ email, username });
    await user.setPassword(password);
    await user.save();

    ctx.body = user.serialize();

    const token = user.generateToken();
    ctx.cookies.set('access_token', token, {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
    });
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const login = async (ctx) => {
  // 로그인
  const { email, password } = ctx.request.body;
  if (!email || !password) {
    ctx.status = 401;
    return;
  }

  try {
    const user = await User.findByEmail(email);
    if (!user) {
      ctx.status = 401;
      return;
    }

    const valid = await user.checkPassword(password);
    if (!valid) {
      ctx.status = 401;
      return;
    }

    ctx.body = user.serialize();

    const token = user.generateToken();
    ctx.cookies.set('access_token', token, {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
    });
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const check = async (ctx) => {
  // 로그인 상태 확인
  const { user } = ctx.state;
  if (!user) {
    ctx.status = 401;
    return;
  }

  ctx.body = user;
};

export const logout = async (ctx) => {
  // 로그아웃
  ctx.cookies.set('access_token');
  ctx.status = 204;
};
