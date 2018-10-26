const express = require('express');
const router = express.Router();
const ipfsAPI = require('ipfs-api');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));


// console.log('web3', web3);

const MAX_SIZE = 52428800;

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, path.join(__dirname, 'uploads'));
    },
    filename(req, file, cb) {
        cb(null, `${Date.now()}.${file.mimetype.split('/')[1]}`);
    },
});

const upload = multer({ storage });

// connect to ipfs daemon API server
const ipfs = ipfsAPI('localhost', '5001', { protocol: 'http' })



// const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });


router.get('/test', (req, res) => {
    res.send(' Up and running');
});

router.get('/status', async (req, res, next) => {
    try {
        const resp = await web3.eth.net.isListening();
        res.send({ "status": resp ? 200 : 400 });
    }
    catch (err) {
        console.log(err);
        res.status(500).send(err.message)
    }
});


/*  upload POST endpoint */
router.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(422).json({
            error: 'File needs to be provided.',
        });
    }

    const mime = req.file.mimetype;
    if (mime.split('/')[0] !== 'image') {
        fs.unlink(req.file.path);

        return res.status(422).json({
            error: 'File needs to be an image.',
        });
    }

    const fileSize = req.file.size;
    if (fileSize > MAX_SIZE) {
        fs.unlink(req.file.path);

        return res.status(422).json({
            error: `Image needs to be smaller than ${MAX_SIZE} bytes.`,
        });
    }

    const data = fs.readFileSync(req.file.path);
    return ipfs.add(data)
        .then((file) => {
            if (file) {
                return res.send({
                    hash: file[0].hash,
                });
            }
        })
        .catch((err) => {
            console.log('err', err)
            res.status(500).send(
                {
                    error: err.message,
                }
            )
        })
})

module.exports = router;