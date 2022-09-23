import Web3 from 'web3';
import ganache from 'ganache-cli';
import { Contract } from 'web3-eth-contract';
import compile from '../compile';

const web3 = new Web3(ganache.provider());

let accounts: string[] = [];
let inbox: Contract;
const defaultMessage = 'Hello, world!';

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  inbox = await new web3.eth.Contract(compile.abi)
    .deploy({
      data: compile.bytecode,
      arguments: [defaultMessage],
    })
    .send({ from: accounts[0], gas: 1000000 });
});

describe('Inbox contract', () => {
  test('Should deploy a contract', () => {
    expect(inbox).toHaveProperty('options.address');
  });

  test('Should have a default message', async () => {
    const message = await inbox.methods.message().call();
    expect(message).toEqual(defaultMessage);
  });

  test('Should update the message', async () => {
    const newMessage = 'Hey!';
    await inbox.methods
      .setMessage(newMessage)
      .send({ from: accounts[0], gas: 1000000 });
    const updatedMessage = await inbox.methods.message().call();
    expect(updatedMessage).toEqual(newMessage);
  });
});
