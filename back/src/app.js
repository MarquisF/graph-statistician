
/**
 * node_modules dependencies
 */
const http = require('http');
// const https = require('https');
const Koa = require('koa');
const Router = require('koa-router');
const cors = require('koa2-cors');
const mongoose = require('mongoose');
const bodyParser = require('koa-bodyparser');
const socketIo = require('socket.io');

process.on('uncaughtException', function (err) {
	//打印出错误
	console.log(err);
	//打印出错误的调用栈方便调试
	console.log(err.stack);
});

/**
 * local files
 */
const appRoutes = require('./routes/index');

/**
 * create instances
 */
const app = new Koa();
const router = new Router();

/**
 * connect to mongodb server
 */
mongoose.connect(
  'mongodb://localhost/graphStatistician',
  {
    useNewUrlParser: true
  }
);

app.context.db = mongoose.connection;
app.context.db.on('error', console.error.bind(console, 'connection error:'));
app.context.db.once('open', () => {
  console.log('The system is connected to MongoDB');
})

/**
 * load middlewares
 */
app.use(cors({
  origin: '*',
  credentials: true,
  allowMethods: ['GET', 'POST', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept']
}));
app.use(bodyParser());
app.use(appRoutes.routes());

/**
 * start the http server
 */
const httpServer = http.createServer(app.callback()).listen(3050);
const io = socketIo(httpServer);
/**
 * load socket.io
 */
const emitter = require('./models/emitter');

io.on('connection', socket => {
  console.log('A user connected');

  emitter.on('updatedGraph', socketInfo => {
    const { graphId, data } = socketInfo;
    socket.emit(`updatedGraph/${graphId}`, data);
  });
  socket.on('disconnect', reason => {
    console.log('io disconnected');
  });
})

console.log('The event tracker is listening on port 3050');
