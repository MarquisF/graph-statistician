const CommentModel = require('../models/Comment');

exports.getAll = async fields => {
  const query = CommentModel.find(fields);
  return await query.exec();
}

exports.post = async data => {
  const commentData = new CommentModel(data);
  return await commentData.save();
}