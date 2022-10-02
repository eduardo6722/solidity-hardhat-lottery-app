import * as dotenv from 'dotenv';
dotenv.config();
import Web3 from 'web3';
import HDWalletProvider from '@truffle/hdwallet-provider';
import compile from './compile';

const provider = new HDWalletProvider(
  process.env.SECRET_MNEMONIC as string,
  process.env.PROVIDER_URL as string
);

const web3 = new Web3(provider);

async function deploy() {
  const accounts = await web3.eth.getAccounts();
  console.log('Attempting to deploy from account', accounts[0]);
  const result = await new web3.eth.Contract(compile.abi)
    .deploy({
      data: compile.bytecode,
    })
    .send({
      gas: 1000000,
      from: accounts[0],
    });
  console.log('Contract deployed to', result.options.address);
  return;
}

deploy();
