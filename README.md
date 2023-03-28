# **Lottery**
## This repository holds the Lottery DApp created and deployed 
## to the Goerli testnet you can see the link below

---

All the file are split in the two main directories
- lottery
- lottery-react

This keeps the front end and solidity code nice and seperate

---
## Lottery files 

*package.json*

holds the dependancies for this project and can be utilized to install necessary artefacts

*lottery/compile.js*

The file used for compilation that creates an output of lottery.json that holds the details that we will need for deployment

*lottery/deploy.js*

The file used for the deployment of the file onto the Goerli test network. This uses a .env file to read in the necessary details
that obviously have to be kept private. One is not included in this repo instead you will have to create them yourself see the file EXAMPLEDOTENV
It uses a metamask key so the user has to have a metamask wallet.

*lottery/contracts/lottery.sol*

The lottery contract

*lottery/test/lottery.test.json*

The test file with a number of automated tests run to check that everything is doing what it should before deployment

lottery/lottery.json

The file created when the contract was compiled

---
## Lottery-react files

*lottery-react/src/App.js*

This is the only react file that I made any changes too as it is a simple front end
the rest of the files that are in **lotter-react/public and lottery-react/src** 
are from react itself so I haven't done anything to them
but included them as they may be needed

---

The files have all been commented  going through the relevant areas of code and in some places details decisions made 
In this I found the soilidty code fairly straight forward to create but the difficulties came with the compilation 
and usage of the output in the deployment.

---

[Link to deployed Lottery contract](https://learning-technology.co.uk/Crypto/Lottery/)

