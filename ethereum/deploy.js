/*const HDWalletProvider = require("truffle-hdwallet-provider");
const Web3 = require("web3");
const compiledFactory = require("./build/PropertyFactory.json");

const provider = new HDWalletProvider(
  "rug wage cricket oven engine cart still emerge distance rubber switch current",
  "https://rinkeby.infura.io/v3/90b82c404d624db68e03414d15a35e37"
  );

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log("Deploying contract from account", accounts[0]);

  const result = await new web3.eth.Contract(compiledFactory.abi)
    .deploy({ data: compiledFactory.evm.bytecode.object })
    .send({ gas: "1000000", from: accounts[0] });
  console.log("Contract deployed to", result.options.address);
};

deploy();*/

const HDWalletProvider = require("truffle-hdwallet-provider");
const Web3 = require("web3");
const compiledFactory = require("./build/PropertyFactory.json");

const provider = new HDWalletProvider(
  "rug wage cricket oven engine cart still emerge distance rubber switch current",
  "https://rinkeby.infura.io/v3/90b82c404d624db68e03414d15a35e37"
);

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log("Deploying contract from account", accounts[0]);

  const result = await new web3.eth.Contract(compiledFactory.abi)
    .deploy({ data: compiledFactory.evm.bytecode.object })
    .send({ gas: "3000000", from: accounts[0] });
  console.log("Contract deployed to", result.options.address);
};

deploy();