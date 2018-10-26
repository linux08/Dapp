const express = require('express');
const router = express.Router();
const ipfsAPI = require('ipfs-api');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
const code = fs.readFileSync('./contracts/StoreHash.sol').toString();
const solc = require('solc');
const compiledCode = solc.compile(code);
const abi = JSON.parse(compiledCode.contracts[':SaveFile'].interface);
// console.log('abi', abi)
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
const ipfs = ipfsAPI('localhost', '5001', { protocol: 'http' })



// const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });


router.get('/test', (req, res) => {
    res.send(' Up and running');
});


router.get('/accounts', async (req, res) => {
    try {
        const accounts = await web3.eth.getAccounts();
        res.send(accounts);
    }
    catch (err) {
        res.status(500).send(err.message);
    }
});


router.get('/transaction', async (req, res) => {
    try {
        //bring in user's metamask account address
        const accounts = await web3.eth.getAccounts();
        console.log('accounts', accounts)
        const resp = await web3.eth.getTransactionReceipt('0x1cc752c0683b5f9b85c1ef60ba207503cee7c2444114d60502d34cb2d0c320e3');
        res.send(resp);
    }
    catch (err) {
        res.status(500).send(err.message);
    }
})

router.get('/files', async (req, res) => {
    try {
        const resp = await SavingContract.allEvents({ fromBlock: 0, toBlock: 'latest' });//.methods.getHash()
        // .send({
        //     from: '0xb1caf625d9d29421dfd8dae4a7a9083b4175f80a'
        // });
        console.log('reps', resp);
        res.send(resp);
    }
    catch (err) {
        res.status(500).send(err.message);
    }
});

router.post('/files', async (req, res) => {
    try {
        //bring in user's metamask account address
        const accounts = await web3.eth.getAccounts();
        const resp = await SavingContract.methods.sendHash('QmdsR2tPaBZZQGT6JyutvZPzmGmQdaZ4a1cKwUV4LJ7R3c').send({
            from: accounts[0]
        });
        console.log('reps', resp);
        res.send(resp);
    }
    catch (err) {
        res.status(500).send(err.message);
    }
})




router.get('/status', async (req, res) => {
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
});


//Getting the uploaded file via hash code.
router.get('/getfile/:hash', async (req, res) => {

    //This hash is returned hash of addFile router.
    const validCID = req.params.hash

    try {
        const files = await ipfs.files.get(validCID);
        files.forEach((file) => {
            console.log(file)
            // console.log(file.content.toString('utf8'))
            res.send(file)

        })
    }
    catch (err) {
        res.status(500).send(err.message);
    }
})


module.exports = router;