const express = require('express')
const Biconomy = require("@biconomy/mexa");
const Web3 = require("web3");
var cors = require('cors')

var app = express()

app.use(cors())
app.use(express.json())


const port = 3001

const provider = new Web3(new Web3.providers.HttpProvider('https://kovan.infura.io/v3/18e7e4789b86468c8d617a4f1f2db154'));
const biconomy = new Biconomy.Biconomy(provider.currentProvider, {apiKey: "_OOqEikTt.908d7444-a0a1-4db6-9387-290141395dc0", 
  // debug: true
});

let erc20ForwarderClient;

biconomy.onEvent(biconomy.READY, () => {
  // Initialize your dapp here like getting user accounts etc
  erc20ForwarderClient = biconomy.erc20ForwarderClient;
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
}).onEvent(biconomy.ERROR, (error, message) => {
  // Handle error while initializing mexa
  console.log(`Error`)
});

app.get('/', (req, res) => {
  console.log('Hello World!')
  res.send('Hello World!')
})

/* 
  body: {
    transactioObj: {},
    userSign: ""
  }
*/

app.post('/sendBiconomyTransaction', async (req, res) => {
  try {
    const data = req.body
    console.log('Processing call....');
    let transaction = await erc20ForwarderClient.sendTxEIP712(
      {
        req: req.body.transactionObj,
        signature: req.body.userSign,
        // metaInfo: metaInfo,
        userAddress: req.body.userAddress
      }
    );
    console.log(transaction.txHash)
    res.send(transaction);
  }
  catch(e) {
    console.log(e)
    res.status(500).send(e.message)
  }
})