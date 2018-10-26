const emitter = require('../models/emitter.js');
const arcModel = require('../models/Arc');
const graphModel = require('../models/Graph');
const vertexModel = require('../models/Vertex');
const vertexColModel = require('../models/VertexCol');

exports.get = async ctx => {
  const { graphId } = ctx.params;
  const group = await Promise.all([
    graphModel.findById(graphId),
    vertexModel.find({graphId}).select('url path'),
    arcModel.find({graphId}).select('source target'),
    vertexColModel.find({graphId})
  ]);
  ctx.body = {
    graph: group[0],
    vertexes: group[1],
    arcs: group[2],
    vertexCol: group[3]
  };
}

exports.post = async ctx => {
  const { name } = ctx.request.body;
  const res = await graphModel.create({name});
  ctx.body = res;
}

exports.getAll = async ctx => {
  const res = await graphModel.find({});
  ctx.body = res;
}
