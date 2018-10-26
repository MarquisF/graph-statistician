const Router = require('koa-router');

const graph = require('./graph');
const arc = require('./arc');
const vertexCol = require('./vertexCol');

const router = new Router();

router
  // .post('/login', login)
  // .get('/assets', assets)
  // .post('/register', register)
  .post('/arc', arc.post)
  .get('/graph/:graphId', graph.get)
  .post('/graph', graph.post)
  .get('/graphs', graph.getAll)
  .post('/vertex_col', vertexCol.post);

module.exports = router;