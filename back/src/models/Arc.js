const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ArcSchema = new Schema({
  source: {
    type: Schema.Types.ObjectId, ref: 'Vertex',
  },
  target: {
    type: Schema.Types.ObjectId, ref: 'Vertex',
  },
  graphId: {
    type: Schema.Types.ObjectId, ref: 'Graph',
  }
});

module.exports = mongoose.model('Arc', ArcSchema);