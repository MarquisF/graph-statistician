const UserModel = require('../models/User');

exports.get = async fields => {
  const query = UserModel.findOne(fields);
  return await query.exec();
}

exports.post = async data => {
  const userData = new UserModel(data);
  return await userData.save();
}