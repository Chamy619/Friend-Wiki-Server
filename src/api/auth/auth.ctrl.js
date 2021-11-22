import Joi from 'joi';
import User from '../../models/users';
import axios from 'axios';
import qs from 'qs';

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
  const { email, password, code } = ctx.request.body;
  if ((!email || !password) && !code) {
    ctx.status = 401;
    return;
  }

  try {
    let user;
    if (email && password) {
      user = await loginForEmailAndPassword(email, password);
    } else {
      user = await loginForOauth(code);
    }
    ctx.body = user.serialize();

    const token = user.generateToken();
    ctx.cookies.set('access_token', token, {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
    });
  } catch (e) {
    ctx.status = 401;
    return;
  }
};

const loginForEmailAndPassword = async (email, password) => {
  const user = await User.findByEmail(email);
  if (!user) {
    throw new Error('Not registered email');
  }

  const valid = await user.checkPassword(password);
  if (!valid) {
    throw new Error('Worng password');
  }

  return user;
};

const loginForOauth = async (code) => {
  try {
    const accessToken = await getKakaoAccessToken(code, process.env.KAKAO_LOGIN_REDIRECT_URI);
    const userId = await getKakaoUserId(accessToken);

    const user = await User.findByKakaoId(userId);
    return user;
  } catch (e) {
    throw new Error('Kakao Error');
  }
};

const getKakaoAccessToken = async (code, redirectUri) => {
  const body = {
    grant_type: 'authorization_code',
    client_id: process.env.KAKAO_CLIENT_ID,
    client_secret: process.env.KAKAO_CLIENT_SECRET,
    redirect_uri: redirectUri,
    code,
  };

  try {
    const response = await axios.post(process.env.KAKAO_AUTH_SERVER, qs.stringify(body), {
      headers: {
        'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
    });

    return response.data.access_token;
  } catch (e) {
    throw new Error(e);
  }
};

const getKakaoUserId = async (accessToken) => {
  const headers = {
    'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
    authorization: `Bearer ${accessToken}`,
  };
  try {
    const response = await axios.post(process.env.KAKAO_API_SERVER, {}, { headers });
    return response.data.id;
  } catch {
    throw new Error('Access token is not valid');
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

// 간편 인증
export const oauth = async (ctx) => {
  const schema = Joi.object().keys({
    code: Joi.string().required(),
  });

  const result = schema.validate(ctx.request.body);
  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  const { user } = ctx.state;
  const { code } = ctx.request.body;

  try {
    const accessToken = await getKakaoAccessToken(code, process.env.KAKAO_AUTHENTICATION_REDIRECT_URI);
    const userId = await getKakaoUserId(accessToken);

    if (await User.findByKakaoId(userId)) {
      ctx.status = 409;
      return;
    }

    await User.findByIdAndUpdate(user._id, { kakaoId: userId });
    const updateUserData = await User.findById(user._id);
    ctx.body = updateUserData.serialize();
    return;
  } catch {
    ctx.status = 401;
    return;
  }
};
