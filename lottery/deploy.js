const Web3 = require("web3");

// Loading the contract ABI and Bytecode
// (the results of a previous compilation step)
const fs = require("fs");
const { abi, bytecode } = JSON.parse(fs.readFileSync("Lottery.json"));
async function main() {
  // Configuring the connection to an Ethereum node
  //All hidden in a .env file
  const network = process.env.ETHEREUM_NETWORK;
  //hook up to our node which is infura goerli network
  const web3 = new Web3(
    new Web3.providers.HttpProvider(
      `https://${network}.infura.io/v3/${process.env.INFURA_API_KEY}`
    )
  );
  //Use metamasks private key to one of the accounts
  // Creating a signing account from a private key
  const signer = web3.eth.accounts.privateKeyToAccount(
    process.env.SIGNER_PRIVATE_KEY
  );
  web3.eth.accounts.wallet.add(signer);
  console.log("About to sign account")
  // Using the signing account to deploy the contract
  const contract = new web3.eth.Contract(abi);
  //Not sure about this line 
  contract.options.data = bytecode;
 
//Thought this may do the same
  const deployTx = contract.deploy({ data: bytecode });
//Run the deploy 
  const deployedContract = await deployTx
    .send({
      from: signer.address,
      gas: '1000000',
      //gas: await deployTx.estimateGas(),
    })
    .once("transactionHash", (txhash) => {
      console.log(`Mining deployment transaction ...`);
      console.log(`https://${network}.etherscan.io/tx/${txhash}`);
    });
  // The contract is now deployed on chain!
  console.log(`Contract deployed at ${deployedContract.options.address}`);
  console.log(
    `Add LOTTERY_CONTRACT to the.env file to store the contract address: ${deployedContract.options.address}`
  );
}
//Make sure you have this dotenv loaded if not use the following
//npm i dotenv
require("dotenv").config();
main();