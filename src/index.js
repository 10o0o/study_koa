const koa = require('koa');
const Router = require('koa-router');

const app = new koa();
const router = new Router();
const api = require('./api');


router.use('/api', api.routes())

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(4000, () => {
  console.log('herum server is listening to port 4000');
});