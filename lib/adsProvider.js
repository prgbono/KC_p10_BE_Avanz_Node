'use strict'

var express = require('express');
const Ad = require('../models/Ad');

async function getAds (req) {
  const isType = req.query.venta;
  const name = req.query.nombre;
  const tags = req.query.tag;
  const price = req.query.precio;
  const limit = parseInt(req.query.limit);
  const skip = parseInt(req.query.skip);
  const filter = {};
  if (isType) filter.isType = isType;
  if (name) filter.name = { $regex: name, $options: 'i'};
  if (tags) filter.tags = tags;
  if (price) {
    const priceRangePosition = price.indexOf('-');
    priceRangePosition === -1 
      ? filter.price = price
      : filter.price = calculatePriceRange(priceRangePosition, price.replace('-',''));
  }
  const response = await Ad.list(filter, limit, skip);
  return response
}

// TODO: Move to a util.js file
function calculatePriceRange(position, price){
  switch (position) {
    case price.length:
      return {$gt: price}     
      break;
    case 0:
      return {$lt: price}
      break;
    default:
      const min = price.substr(0, position);
      const max = price.substr(position, price.length);
      return {$gt: min, $lt: max}
      break;
  }
}

module.exports = {getAds}
