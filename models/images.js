const mongoose = require('mongoose');


const imageSchema = mongoose.Schema({
  label: {
    type: String,
  },
  ipfsHash: {
    type: String,
  },
  transactionHash: {
    type: String,
  },
  blockHash: {
    type: String,
  },
}, {
  timestamps: true,
});

imageSchema.index({ label: 1 });


module.exports = mongoose.model('Image', imageSchema);
