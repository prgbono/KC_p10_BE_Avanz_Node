// Microservice for making thumbnails 100x100 of the images received

const cote = require('cote');
const responder = new cote.Responder({ name: 'ms_thumbnailMaker_responder' });

responder.on('thumbnail', (req, done) => {
  console.log('Microservice, req object. See params: ', req);
  // Tengo la imagén en req.pathToFileUploaded
  result = 'ms_result';
  // console.log('Microservice, responder done param: ', done);

  done(result);
});
