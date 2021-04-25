'use strict';

const mongoose = require('mongoose');

// Schema
const adSchema = mongoose.Schema({
  name: {
  	type: String,
  	trim: true,
    required: true,
    index: true
  },
  description: {
  	type: String,
  	trim: true,
  },
  isType: {
    type: String,
    enum: ["vende", "busca"],
    required: true,
    index: true
	},
  price: {
    type: Number,
	},
  image: {
    type: String,
  },    
  tags: {
    type: [String],
    // enum: ["work", "lifestyle", "motor", "mobile"]
    index: true
	}
}, {
  collection: 'anuncios'
});

adSchema.statics.list = function(filter, limit, skip) {
  // Don't use arrow functions on Mongoose methods
  const query = Ad.find(filter);
  query.limit(limit);
  query.skip(skip);
  return query.exec();
}

// Model
const Ad = mongoose.model('Ad', adSchema);

// Export model
module.exports = Ad;

