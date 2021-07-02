require('dotenv').config();

const koa = require('koa');
const Router = require('koa-router');

const app = new koa();
const router = new Router();
const api = require('./api');

const mongoose = require('mongoose');
const bodyParser = require('koa-bodyparser')

// ?
mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(
  (response) => {
    console.log('Successfully connected to mongodb');
  }
).catch(e => {
  console.error(e);
});

const port = process.env.PORT || 4000;

app.use(bodyParser());

router.use('/api', api.routes())
app.use(router.routes()).use(router.allowedMethods());

app.listen(port, () => {
  console.log('herum server is listening to port 4000');
});