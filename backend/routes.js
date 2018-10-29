const express = require('express');

const router = express.Router();
const ipfsAPI = require('ipfs-api');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
const code = fs.readFileSync('./contracts/StoreHash.sol').toString();
const solc = require('solc');

const compiledCode = solc.compile(code);
const abi = JSON.parse(compiledCode.contracts[':SaveAddress'].interface);
const SavingContract = new web3.eth.Contract(abi, '0xb1caf625d9d29421dfd8dae4a7a9083b4175f80a');


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
// const ipfs = ipfsAPI('localhost', '5001', { protocol: 'http' })

const ipfs = new ipfsAPI({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });
// https://gateway.ipfs.io/ipfs/:hash


const test = (req, res) => {
    res.send(' Up and running');
};

const accounts = async (req, res) => {
    try {
        const accounts = await web3.eth.getAccounts();
        res.send(accounts);
    } catch (err) {
        res.status(500).send(err.message);
    }
};
const transaction = async (req, res) => {
    try {
        // bring in user's metamask account address
        const accounts = await web3.eth.getAccounts();
        const resp = await web3.eth.getTransactionReceipt('0x1cc752c0683b5f9b85c1ef60ba207503cee7c2444114d60502d34cb2d0c320e3');
        res.send(resp);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

const getData = async (req, res) => {
    if (!req.params.name) {
        return res.status(422).json({
            error: 'name needs to be provided.',
        });
    }
    const accounts = await web3.eth.getAccounts();
    const ethAddress = await SavingContract.options.address;
    try {
        const resp = await SavingContract.methods.getHash(req.params.name)
            .send({
                from: accounts[0],
            });

        res.send(resp);
    } catch (err) {
        res.status(500).send(err.message);
    }
};
const postData = async (req, res) => {
    try {

        const { hash } = req.data[0];
        const ethAddress = await SavingContract.options.address;
        const accounts = await web3.eth.getAccounts();

        const resp = await SavingContract.methods.saveHash(hash)
            .send({
                from: accounts[0],
            });
        const data = Object.assign({ ipfsHash: hash }, resp);
        res.send(data);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

const webStatus = async (req, res) => {
    try {
        const resp = await web3.eth.net.isListening();
        res.send({ status: resp ? 200 : 400 });
    } catch (err) {
        res.status(500).send(err.message);
    }
};

const uploadFile = async (req, res, next) => {
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
    data.name = 'sam';
    return ipfs.add(data)
        .then((file) => {
            if (file) {
                req.data = file;
                next();
            } else {
                res.status(400).send('Error processing file');
            }
        })
        .catch((err) => {
            res.status(500).send(err.message);
        });
};

const getFile = async (req, res) => {
    // This hash is returned hash of addFile router.
    const validCID = req.params.hash;

    try {
        const files = await ipfs.files.get(validCID);
        files.forEach((file) => {
            res.send(file);
        });
    } catch (err) {
        res.status(500).send(err.message);
    }
};

router.get('/', test);
router.get('/accounts', accounts);
router.get('/web3-status', webStatus);
// router.get('/transcations', transaction);
router.get('/files/:name', getData);

/*  upload POST endpoint */
router.post('/upload', upload.single('file'), uploadFile, postData);

router.get('/getfile/:hash', getFile);

module.exports = router;
