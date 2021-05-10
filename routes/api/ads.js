var express = require('express');
var router = express.Router();
var path = require('path');
const Ad = require('../../models/Ad');
const asyncHandler = require('express-async-handler');
const adsProvider = require('../../lib/adsProvider');
const jwtAuth = require('../../lib/jwtAuth');
const cote = require('cote');
var multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, './../../public/images'));
  },
  filename: function (req, file, cb) {
    // cb(null, file.fieldname + path.extname(file.originalname));
    cb(null, file.originalname);
  },
  // TODO: Check extension file: --- Not working ---
  // fileFilter: (req, file, next) => {
  //   const filetypes = /jpeg|jpg|bmp|tiff|png|gif/; //jimp supported formats
  //   const mimetype = filetypes.test(file.mimetype);
  //   const fileExtension = filetypes.test(path.extname(file.originalname));
  //   if (!mimetype || !fileExtension) {
  //     const error = new Error('File selected is not a valid image');
  //     error.status = 400;
  //     next(error);
  //     console.log('WRONG FILE TYPE');
  //     return;
  //   }
  //   return next(null, true);
  // },
});

// GET /api/ads -> List ads
router.get(
  '/',
  jwtAuth,
  asyncHandler(async function (req, res) {
    const response = await adsProvider.getAds(req);
    res.json(response);
  }),
);

// POST / api / ads(body);
router.post(
  '/',
  // multerConfig.single('image'),
  // jwtAuth,
  asyncHandler(async (req, res) => {
    let upload = multer({ storage }).single('image');
    upload(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: err });
      } else if (err) {
        return res.status(400).json({ message: err });
      }

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
        },
        //() => {},// Not needed as microservice is not retrieving anything
      );

      //add new ad to db
      const adCreated = await ad.save();
      res.status(201).json({ result: adCreated });
      // FIXME: check view after inserting the new Ad
    });
  }),
);

// PUT /api/ads:id (body)
router.put(
  '/:id',
  jwtAuth,
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
  jwtAuth,
  asyncHandler(async (req, res, next) => {
    const _id = req.params.id;
    await Ad.deleteOne({ _id }); // === { _id: _id}
    res.json();
  }),
);

module.exports = router;
