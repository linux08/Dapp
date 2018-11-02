const mongoose = require('mongoose');


const imageSchema = mongoose.Schema({

  label: {
    type: String,
  },

}, {
  timestamps: true,
});

imageSchema.index({ email: 1 });


module.exports = mongoose.model('Image', imageSchema);
