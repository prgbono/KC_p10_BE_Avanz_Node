'use strict';

const mongoose = require('mongoose');

mongoose.connection.on('error', err => {
  console.log('Error de Conexión a la BBDD Mongo: ', err);
  process.exit(1);
});

mongoose.connection.once('open', () => {
  console.log('DB up and running at', mongoose.connection.name);
});

//TODO: Move to config file which will be in .gitignore
mongoose.connect('mongodb://localhost/nodepop', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

module.exports = mongoose.connection;
