const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VertexColumnSchema = new Schema({
  key: {
    type: String,
    trim: true,
    index: true
  },
  data: {
    type: Array,
    trim: true,
    index: true
  },
  graphId: {
    type: Schema.Types.ObjectId, ref: 'Graph',
  }
});

module.exports = mongoose.model('VertexColumn', VertexColumnSchema);
