const koa = require('koa');
const Router = require('koa-router');

const app = new koa();
const router = new Router();

// app.use(async (ctx, next) => {
//   // console.log(1);
//   // const started = new Date();
//   // next().then(() => {
//   //   console.log(new Date() - started + 'ms');
//   // })
  
//   console.log(1);
//   const started = new Date();
//   await next();
//   console.log(new Date() - started + 'ms');
// });

// app.use((ctx, next) => {
//   console.log(2);
//   next();
// })

// app.use(ctx => {
//   ctx.body = 'Hello Koa';
// });

router.get('/', (ctx, next) => {
  ctx.body = 'home';
});

router.get('/test', (ctx, next) => {
  ctx.body = 'test';
});

router.get('/about/:name', (ctx, next) => {
  const { name } = ctx.params;
  ctx.body = name + '의 소개';
})

router.get('/post', (ctx, next) => {
  const { id } = ctx.request.query;
  if(id) ctx.body = '포스트 #' + id;
  else ctx.body = '포스트 아이디가 없습니다.';
});

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(4000, () => {
  console.log('herum server is listening to port 4000');
});