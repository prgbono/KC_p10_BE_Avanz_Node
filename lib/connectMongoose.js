'use strict';

const mongoose = require('mongoose');

mongoose.connection.on('error', (err) => {
  console.log('Error de Conexión a la BBDD Mongo: ', err);
  process.exit(1);
});

mongoose.connection.once('open', () => {
  console.log('DB up and running at', mongoose.connection.name);
});

mongoose.connect(process.env.MONGODB_CONNECTION_STR, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = mongoose.connection;
