const express = require('express');

const router = express.Router();
const Image = require('./controllers/images');

router.get('/', Image.test);
router.get('/accounts', Image.accounts);
router.get('/web3-status', Image.webStatus);

router.get('/files/:name', Image.getData);

/*  upload POST endpoint */
router.post('/upload', Image.upload.single('file'), Image.uploadFile, Image.postData);

router.get('/getfile/:hash', Image.getFile);

module.exports = router;
