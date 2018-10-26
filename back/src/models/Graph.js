const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GraphSchema = new Schema({
  name: {
    type: String,
    trim: true,
    index: true
  }
});

module.exports = mongoose.model('Graph', GraphSchema);