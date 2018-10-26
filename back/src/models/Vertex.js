const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VertexSchema = new Schema({
  url: {
    type: String,
    trim: true,
    index: true
  },
  path: {
    type: String,
    trim: true,
    index: true
  },
  graphId: {
    type: Schema.Types.ObjectId, ref: 'Graph',
  }
});

module.exports = mongoose.model('Vertex', VertexSchema);