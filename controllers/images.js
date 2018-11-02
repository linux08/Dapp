const IpfsAPI = require('ipfs-api');
// connect to ipfs daemon API server
// const ipfs = IpfsAPI('localhost', '5001', { protocol: 'http' })

const ipfs = new IpfsAPI({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });
// https://gateway.ipfs.io/ipfs/:hash
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
const Image = require('../models/images');

const MAX_SIZE = 52428800;

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}.${file.mimetype.split('/')[1]}`);
  },
});


exports.upload = multer({ storage });

exports.test = (req, res) => {
  res.send(' Up and running');
};

exports.accounts = async (req, res) => {
  try {
    const accounts = await web3.eth.getAccounts();
    res.send(accounts);
  } catch (err) {
    res.status(500).send(err.message);
  }
};
exports.transaction = async (req, res) => {
  try {
    // bring in user's metamask account address
    const accounts = await web3.eth.getAccounts();
    const resp = await web3.eth.getTransactionReceipt('0x1cc752c0683b5f9b85c1ef60ba207503cee7c2444114d60502d34cb2d0c320e3');
    res.send(resp);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.getData = async (req, res) => {
  if (!req.params.name) {
    return res.status(422).json({
      error: 'name needs to be provided.',
    });
  }
  const accounts = await web3.eth.getAccounts();
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

exports.postData = async (req, res) => {
  try {
    const { hash } = req.data[0];
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

exports.webStatus = async (req, res) => {
  try {
    const resp = await web3.eth.net.isListening();
    res.send({ status: resp ? 200 : 400 });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.uploadFile = async (req, res, next) => {
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
  // data.name ='sam';
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

exports.getFile = async (req, res) => {
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


exports.all = async (req, res) => {
  const page = parseInt(req.query.page) || 0;
  const limit = parseInt(req.query.limit) || 10;

  try {
    const resp = await Image.find()
      .limit(limit)
      .sort('updatedAt');
    res.send(resp);
  } catch (err) {
    res.status(500).send(err.message);
  }
};