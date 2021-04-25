var express = require('express');
var router = express.Router();

const Ad = require('../../models/Ad');
const asyncHandler = require('express-async-handler');

// GET /api/tags -> List tags
router.get('/', asyncHandler(async function(req, res){  
  const response = await Ad.distinct('tags');
  let arrayTags = [];
  response.forEach((tag) => {
    if (tag.indexOf('[')!== -1) {
      tag = JSON.parse(tag);
      if (Array.isArray(tag)) {
        tag.forEach(ta => {
          if (!arrayTags.includes(ta)) { arrayTags.push(ta) }
        })
      }
    }
    else {
      if (!arrayTags.includes(tag)) { arrayTags.push(tag) }
    }
  })
  res.json(arrayTags);
}));

module.exports = router;