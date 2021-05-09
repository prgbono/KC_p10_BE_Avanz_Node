var express = require('express');
var router = express.Router();
var path = require('path');
const Ad = require('../../models/Ad');
const asyncHandler = require('express-async-handler');
const adsProvider = require('../../lib/adsProvider');
const jwtAuth = require('../../lib/jwtAuth');
const cote = require('cote');
var multer = require('multer');
var multerConfig = multer({
  dest: path.join(__dirname, './../../public/images'),
  // Check extension file:
  fileFilter: (req, file, next) => {
    const filetypes = /jpeg|jpg|bmp|tiff|png|gif/; //jimp supported formats
    const mimetype = filetypes.test(file.mimetype);
    const fileExtension = filetypes.test(path.extname(file.originalname));
    if (!mimetype || !fileExtension) {
      const error = new Error('File selected is not a valid image');
      error.status = 400;
      next(error);
      return;
    }
    return next(null, true);
  },
});
// }).single('image'); //TODO:HANDLING MULTER ERROR, see /POST

// GET /api/ads -> List ads
router.get(
  '/',
  //TODO: FIXME: jwtAuth,
  jwtAuth,
  asyncHandler(async function (req, res) {
    const response = await adsProvider.getAds(req);
    res.json(response);
  }),
);

// POST / api / ads(body);
router.post(
  '/',
  multerConfig.single('image'),
  // jwtAuth,
  //TODO: FIXME: jwtAuth,
  asyncHandler(async (req, res) => {
    const ad = new Ad(req.body);

    ad.image =
      req.file.filename +
      path.extname(req.file.originalname).toLocaleLowerCase();

    // Call microservice for making thumbnail of the image
    const requester = new cote.Requester({
      name: 'ms_thumbnailMaker_client',
    });
    requester.send(
      {
        type: 'thumbnail',
        pathToFileUploaded: req.file.path,
        destination: req.file.destination,
        filename: req.file.filename,
        // fileExtension: path.extname(req.file.originalname).toLocaleLowerCase(),
      },
      // () => {} Not needed as ms is not retrieving anything
    );

    //add new ad to db
    const adCreated = await ad.save();
    res.status(201).json({ result: adCreated });
  }),
);

// POST /api/ads (body) //TODO:HANDLING MULTER ERROR
// router.post(
//   '/',
//   jwtAuth,
//   multerConfig(req, res, function (err) {
//     if (err instanceof multer.MulterError) {
//       // Multer error occurred when uploading
//       const error = new Error('Error uploading file');
//       error.status = 400;
//       next(error);
//       return;
//     } else if (err) {
//       // Unknown error occurred when uploading
//       const error = new Error('Unknown error');
//       error.status = 400;
//       next(error);
//       return;
//     }
//     // This way the image is not optional //TODO: Add this to ReadMe
//     asyncHandler(async (req, res) => {
//       const ad = new Ad(req.body);
//       ad.image =
//         req.file.filename +
//         path.extname(req.file.originalname).toLocaleLowerCase();
//       const adCreated = await ad.save();
//       res.status(201).json({ result: adCreated });
//     });
//   }),
// );

// PUT /api/ads:id (body)
router.put(
  '/:id',
  jwtAuth, //TODO: NOT Tested!
  asyncHandler(async (req, res) => {
    const _id = req.params.id;
    const adData = req.body;
    const updatedAd = await Ad.findOneAndUpdate({ _id }, adData, {
      new: true, // otherwise it doesn't retrieve the updated document
      useFindAndModify: false,
    });

    if (!updatedAd) {
      return res.status(404).json({ error: 'not found' });
    }

    res.json({ result: updatedAd });
  }),
);

// DELETE /api/ads:id
router.delete(
  '/:id',
  jwtAuth, //TODO: NOT Tested!
  asyncHandler(async (req, res, next) => {
    const _id = req.params.id;
    await Ad.deleteOne({ _id }); // === { _id: _id}
    res.json();
  }),
);

module.exports = router;
