const vertexColModel = require('../models/VertexCol');

exports.post = async ctx => {
  const { graphId, key } = ctx.request.body;
  const res = await vertexColModel.create({graphId, key, data: []});
  ctx.body = res;
}

exports.postNewData = async ctx => {

}

exports.get = async ctx => {
  const { graphId } = ctx.request.body;
  const res = await vertexColModel.find({graphId});
  ctx.body = res;
}
