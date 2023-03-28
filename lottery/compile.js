const fs = require('fs').promises;
const solc = require('solc');

//By doing it this way we can run the compile once and then
//it will create the file which can be read by the test script
//you just have to compile before test if you make any chnges to the code

async function main() {

  // Load the contract source code
  const sourceCode = await fs.readFile('./contracts/Lottery.sol','utf8');
  // Uses the function compile below to compile the source code and retrieve the ABI 
  //and Bytecode
  const { abi, bytecode } = compile(sourceCode, 'Lottery');
  // Store the ABI and Bytecode into a JSON file in a string object
  const artifact = JSON.stringify({ abi, bytecode }, null, 2);
  //Write it to the file Lottery.json which can then be used by the test file
  await fs.writeFile('Lottery.json', artifact);
}

function compile(sourceCode, contractName) {
  // Create the Solidity Compiler Standard Input and Output JSON

  const input = {
    language: 'Solidity',
    sources: { main: { content: sourceCode } },
    settings: { outputSelection: { '*': { '*': ['abi', 'evm.bytecode'] } } },
  };
  // Parse the compiler output to retrieve the ABI and Bytecode
  //Takes in the formatting and catches the output as a string
  const output = solc.compile(JSON.stringify(input));
  //then feeds it into parse to pick out the contract 
  const artifact = JSON.parse(output).contracts.main[contractName];
  //then reads the contract to find the abi and bytecode required
  //and sends them back to the above routine to be output to file
  //console.log(artifact.evm.bytecode.object);
  return {
    abi: artifact.abi,
    bytecode: artifact.evm.bytecode.object,
  };
}

main().then(() => process.exit(0));
