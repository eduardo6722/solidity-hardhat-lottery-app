import path from 'path';
import fs from 'fs';
import solc from 'solc';

const inboxPath = path.resolve(__dirname, 'contracts', 'Inbox.sol');
const source = fs.readFileSync(inboxPath, 'utf8');

let input = {
  language: 'Solidity',
  sources: {
    [inboxPath]: {
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
  abi: output.contracts[[inboxPath] as any]['Inbox'].abi,
  bytecode: output.contracts[[inboxPath] as any]['Inbox'].evm.bytecode.object,
};
