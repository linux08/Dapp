const express = require('express');

const router = express.Router();
const Image = require('./controllers/images');

router.get('/', Image.test);
router.get('/accounts', Image.accounts);
router.get('/web3-status', Image.webStatus);

router.get('/files/:name', Image.getData);

router.get('/images', Image.all);
router.get('/images/:label', Image.findByLabel);
// find image by id
router.get('/images-id/:id', Image.findById);

/*  upload POST endpoint */
router.post('/upload', Image.upload.single('file'), Image.uploadFile, Image.postData, Image.create);

router.get('/getfile/:hash', Image.getFile);

module.exports = router;
