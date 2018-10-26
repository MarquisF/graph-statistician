const emitter = require('../models/emitter.js');
const arcModel = require('../models/Arc');
const graphModel = require('../models/Graph');
const vertexModel = require('../models/Vertex');

exports.post = async ctx => {
  const { vertex, arc, graphId } = ctx.request.body;
  console.log(ctx.request.body);
  // Vertex existance validation
  if (typeof vertex !== 'object' || typeof graphId !== 'string' ) {
    ctx.body = {
      success: 0,
      msg: 'Input error, both vertex and graphId can not be empty'
    };
    return;
  }

  // Check if the new vertex exists in the database already
  // since the vertex has to be unique
  const vertexExist = await vertexModel.findOne({url: vertex.url, graphId}).exec();
  let newVertex, arcData;
  if (vertexExist === null) {
    newVertex = await (new vertexModel({ ...vertex, graphId })).save();
  } else {
    newVertex = vertexExist;
  }

  // Insert new arc into db if it's provided
  if (typeof arc === 'object') {
    const { source, target } = arc;
    // The source and target provided by the front-end are all url strings
    // We need to convert these url strings to vertex id
    // then they can be inserted into the arc table
    const sourceVerdex = await vertexModel.findOne({url: source, graphId}).exec();
    const newArcQuery = new arcModel({
      source: sourceVerdex.id,
      target: newVertex.id,
      graphId
    });

    arcData = await (new arcModel(newArcQuery)).save();

    // Send the new arc info to the front-end through websocket
  }
  const socketInfo = {
    graphId,
    data: {
      vertex: newVertex,
      arc: arcData
    }
  };
  emitter.emit(`updatedGraph`, socketInfo);

  ctx.body = {
    success: 1,
    msg: {}
  };
}
