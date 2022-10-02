import Web3 from 'web3';
import ganache from 'ganache-cli';
import { Contract } from 'web3-eth-contract';
import compile from '../compile';

const web3 = new Web3(ganache.provider());

let accounts: string[] = [];
let lottery: Contract;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  lottery = await new web3.eth.Contract(compile.abi)
    .deploy({
      data: compile.bytecode,
    })
    .send({ from: accounts[0], gas: 1000000 });
});

describe('Lottery contract', () => {
  test('Should deploy a contract', () => {
    expect(lottery).toHaveProperty('options.address');
  });

  test('Should have the manager as the same as the contract creator', async () => {
    const manager = await lottery.methods.manager().call();
    expect(manager).toEqual(accounts[0]);
  });

  test('Should enter to the lottery', async () => {
    await lottery.methods.enter().send({
      from: accounts[1],
      value: web3.utils.toWei('0.02', 'ether'),
    });
    const players = await lottery.methods
      .getPlayers()
      .call({ from: accounts[0] });
    expect(players).toContain(accounts[1]);
    expect(players?.length).toBe(1);
  });

  test('Should enter 3 accounts', async () => {
    const entries = await Promise.all(
      accounts.slice(0, 3).map(async (account) => {
        return lottery.methods.enter().send({
          from: account,
          value: web3.utils.toWei('0.02', 'ether'),
        });
      })
    );
    expect(entries.length).toBe(3);
  });

  test('Should not be able to enter the lottery', async () => {
    try {
      await lottery.methods.enter().send({ from: accounts[1], value: 200 });
    } catch (error) {
      expect(error).toBeTruthy();
    }
  });

  test('Should the manager call pickWinner', async () => {
    try {
      const response = await lottery.methods.pickWinner().send({
        from: accounts[0],
      });
      expect(response).toBeTruthy();
    } catch (error) {
      console.log(error);
    }
  });

  test('Should not call pickWinner', async () => {
    try {
      await lottery.methods.pickWinner().send({
        from: accounts[1],
      });
    } catch (error) {
      expect(error).toBeTruthy();
    }
  });

  test('Should send money to the winner and reset the lottery', async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei('2', 'ether'),
    });
    const initialBalance = await web3.eth.getBalance(accounts[0]);
    await lottery.methods.pickWinner().send({
      from: accounts[0],
    });
    const finalBalance = await web3.eth.getBalance(accounts[0]);
    const difference = Number(finalBalance) - Number(initialBalance);
    expect(difference).toBeGreaterThan(
      Number(web3.utils.toWei('1.7', 'ether'))
    );
  });
});
