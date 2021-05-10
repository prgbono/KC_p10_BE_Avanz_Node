// Microservice for making thumbnails 100x100 of the images received

const cote = require('cote');
const responder = new cote.Responder({ name: 'ms_thumbnailMaker_responder' });
var jimp = require('jimp');

responder.on('thumbnail', async (req, done) => {
  try {
    await generateThumbnail(req);
    done();
  } catch (error) {
    // TODO: Handle error
    console.log('Error while generating thumbnail: ', error);
  }
});

async function generateThumbnail(req) {
  const { pathToFileUploaded, destination, filename } = req;
  const img = await jimp.read(pathToFileUploaded);
  const thumbnail = img.clone();
  const thumbnailName = `${filename.split('.')[0]}_thumbnail.${
    filename.split('.')[1]
  }`;

  thumbnail
    .scaleToFit(100, 100)
    .writeAsync(`${destination}/${thumbnailName}`)
    .then(() => {
      return;
    })
    .catch((err) => {
      console.log('WRITEASYNC Error while saving thumbnail: ', err);
      return err;
    });
}
