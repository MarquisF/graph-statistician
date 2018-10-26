const userController = require('../controllers/user');
const jwt = require('jsonwebtoken');

module.exports = async ctx => {
  const result = await userController.get(ctx.request.body);
  if (!!result) {
    const token = jwt.sign({ foo: 'bar' }, 'shhhhh');
    ctx.body = {
      success: 1,
      msg: {
        token
      }
    };
  } else {
    ctx.body = {
      success: 0,
      msg: 'Authorization Failed'
    }
  }
}