import Joi from 'joi';
import User from '../../models/users';

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
    const exists = await User.findByEmail(email);
    if (exists) {
      ctx.status = 409;
      return;
    }

    const user = new User({ email, username });
    await user.setPassword(password);
    await user.save();

    ctx.body = user.serialize();
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const login = async (ctx) => {
  // 로그인
};

export const check = async (ctx) => {
  // 로그인 상태 확인
};

export const logout = async (ctx) => {
  // 로그아웃
};
