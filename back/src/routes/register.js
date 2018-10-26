const userController = require('../controllers/user');

module.exports = async ctx => {
  const result = await userController.post(ctx.request.body);
  ctx.body = result;
}