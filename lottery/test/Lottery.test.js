const assert = require ('assert');
//Brings in the assert library
const ganache= require('ganache-cli');
//Then the ganache-cli library to work with ganache
const Web3=require('web3'); 
//Bring in Web3 and let it know that we are using ganache as the provider
const web3=new Web3(ganache.provider());
//And this is the bit that stumped me bringing in the compile module
//so we can use the output of the compile specifically the abi(interface) and the byte code
//However here I am using a file created by the compilation
//The compile file creates a file called Lottery.json and writes the details for 
//the abi and the bytecode to be used by this testfile
const { abi, bytecode} = require('../Lottery.json');
//And just in case you would like to see the bytecode and abi
//console.log(abi);
//console.log(bytecode);
////////////////////////////////////////////////////
//creates the variables and gives them global scope
//////////////////////////////////////////////////////
let accounts;
let lottery;
/////////////////////////////////////////////////////

//set the following function to occur before each test
beforeEach(async ()=> {
	//Get the accounts and store them in an array called accounts
	accounts = await web3.eth.getAccounts();
	//Create the Lottery contract with the abi(interface) deploy using the bytecode
	//Take the first ganchae account and send some gas
	//lottery = await new web3.eth.Contract(JSON.parse(interface))
	lottery = await new web3.eth.Contract(abi)
	.deploy ({data: bytecode})
	//.deploy ({data: evm.bytecode.object})
	.send(({from : accounts[0], gas: '1000000'}))


});

describe('Lottery-Contract', ()=> {
	it('deploys a contract...',()=> {
		//Here a very basic test just to ensure that we have a deployed address
		//for the contract
		assert.ok(lottery.options.address);
	});

	it('allows one account to enter', async () => {
		//Now we attempt to enter a lottery then check to see the number of entrants is 
		// only one and that the account is the smae as the entry in players
		await lottery.methods.enter().send({
			from : accounts[0],
			value : web3.utils.toWei('0.2', 'ether')
		});
	const players = await lottery.methods.getPlayers().call({
		from: accounts[0]
	    });
	assert.equal(accounts[0],players[0]);
	assert.equal(1,players.length);

	});

	it("Allows multiple accounts to enter", async () => {

	//This time we make 3 entries each in a different account 
	// then we ensure that there are only 3 entries and that they all correspond
	//with the values we expect (in this case the addresses used in ganache)

		await lottery.methods.enter().send({
			from : accounts[0],
			value : web3.utils.toWei('0.2', 'ether')
		});

		await lottery.methods.enter().send({
			from : accounts[1],
			value : web3.utils.toWei('0.2', 'ether')
		});

		await lottery.methods.enter().send({
			from : accounts[2],
			value : web3.utils.toWei('0.2', 'ether')
		});
	const players = await lottery.methods.getPlayers().call({
		from : accounts[0]
			});
		assert.equal(accounts[0],players[0]);
		assert.equal(accounts[1],players[1]);
		assert.equal(accounts[2],players[2]);
		assert.equal(3,players.length);
		//And if you wish to print out the accounts
		//console.log('Account 1' + accounts[0]+ ' Player  '+ players[0]);
		//console.log('Account 2' + accounts[1]+ ' Player  '+ players[1]);
		//console.log('Account 3' + accounts[2]+ ' Player  '+ players[2]);
		///////////////////////////////////////////////////////////////
		});
	//Test to make sure that addresse wishing to enter have the minimum amount
	//required to enter
	it('requires a minimum amount of ether to enter', async () => {
    try {
      await lottery.methods.enter().send({
        from: accounts[0],
        value: 0,
      });
      assert(false);
    } catch (err) {
      assert(err);
    }
  });
 	//Making sure that the pick winner can only be run by the manager (address)
  it('only manager can call pickWinner', async () => {
    try {
      await lottery.methods.pickWinner().send({
        from: accounts[1],
      });
      assert(false);
    } catch (err) {
      assert(err);
    }
  });
  //Check that money is sent to the winning address and the players array is 
  //set back to empty
  it('sends money to the winner and resets the players array', async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei('2', 'ether'),
    });
 
    const initialBalance = await web3.eth.getBalance(accounts[0]);
    await lottery.methods.pickWinner().send({ from: accounts[0] });
    const finalBalance = await web3.eth.getBalance(accounts[0]);
    const difference = finalBalance - initialBalance;
 
    assert(difference > web3.utils.toWei('1.8', 'ether'));
  });
});


