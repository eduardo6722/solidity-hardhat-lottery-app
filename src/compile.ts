import path from 'path';
import fs from 'fs';
import solc from 'solc';

const lotteryPath = path.resolve(__dirname, 'contracts', 'Lottery.sol');
const source = fs.readFileSync(lotteryPath, 'utf8');

const input = {
  language: 'Solidity',
  sources: {
    [lotteryPath]: {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      '*': {
        '*': ['*'],
      },
    },
  },
};

const output = JSON.parse(solc.compile(JSON.stringify(input)));

export default {
  abi: output.contracts[[lotteryPath] as any]['Lottery'].abi,
  bytecode:
    output.contracts[[lotteryPath] as any]['Lottery'].evm.bytecode.object,
};
