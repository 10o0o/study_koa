const Joi = require('joi');
const Account = require('models/Account');

exports.localRegister = async (ctx) => {
  const schema = Joi.object().keys({
    username: Joi.string().alphanum().min(4).max(15).required(),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(6)
  });

  const result = schema.validate(ctx.request.body);

  if (result.error) {
    ctx.status = 400;
    ctx.body = {
      message: '유효하지 않은 정보입니다.',
      data: ctx.request.body
    }
    return;
  }

  let existing;
  try {
    existing = await Account.findByEmailOrUsername(ctx.request.body);
  } catch (e) {
    ctx.throw(500, e);
  }

  if (existing) {
    ctx.status = 409
    ctx.body = {
      key: existing.email === ctx.request.body.email ? 'email중복!' : 'username중복!'
    }
    return;
  }

  let account;
  try {
    account = await Account.localRegister(ctx.request.body);
  } catch (e) {
    ctx.throw(500, e);
  }

  let token = null;
  try {
    token = await account.generateAccessToken();
  } catch (e) {
    ctx.throw(500, e);
  }

  ctx.cookies.set('access_token', token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7 });

  ctx.body = {
    message: 'Successfully registered!',
    data: account
  }
};

exports.localLogin = async (ctx) => {
  const schema = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  });

  const result = schema.validate(ctx.request.body);

  if (result.error) {
    ctx.status = 400
    ctx.body = {
      message: '유효하지 않은 입력값입니다.',
      data: ctx.request.body
    };
    return;
  }

  const { email, password } = ctx.request.body;

  let account;
  try {
    account = await Account.findByEmail(email);
  } catch (e) {
    ctx.throw(500, e);
  }

  if (!account || !account.validatePassword(password)) {
    ctx.status = 403;
    ctx.body = {
      message: '유저가 존재하지 않거나 비밀번호가 일치하지 않습니다.',
      data: ctx.request.body
    };
    return;
  }
  console.log('전: ', account)
  account = account.toObject();
  delete account.password;
  
  // console.log('boolean?', delete account.email);
  console.log('후: ', account)

  ctx.body = {
    message: 'Successfully login!',
    data: account
  }
}

exports.exists = async (ctx) => {
  const { key, value } = ctx.params;
  let account = null;

  try {
    account = await (key === 'email' ? Account.findByEmail(value) : Account.findByUserName(value));
  } catch (e) {
    ctx.throw(500, e);
  }

  ctx.body = {
    exists: account !== null
  }
}

exports.logout = async (ctx) => {
  ctx.cookies.set('access_token', null, {
    maxAge: 0,
    httpOnly: true
  });

  ctx.status = 204;
}