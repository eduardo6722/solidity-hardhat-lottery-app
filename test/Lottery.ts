import { expect } from 'chai';
import { ethers } from 'hardhat';
import { Lottery } from '../typechain-types';

describe('Lottery', function () {
  const gasLimit = 520000;
  let lottery: Lottery | null = null;

  async function deploy() {
    const [owner] = await ethers.getSigners();
    const Lottery = await ethers.getContractFactory('Lottery');
    Lottery.connect(owner);
    const deployment = await Lottery.deploy();
    return deployment;
  }

  async function enter() {
    const [owner, account2, account3] = await ethers.getSigners();
    await lottery?.connect(owner).enter({
      gasLimit,
      value: ethers.utils.parseEther('1'),
    });
    await lottery?.connect(account2).enter({
      gasLimit,
      value: ethers.utils.parseEther('1'),
    });
    await lottery?.connect(account3).enter({
      gasLimit,
      value: ethers.utils.parseEther('1'),
    });
  }

  this.beforeEach(async () => {
    lottery = await deploy();
  });

  describe('Deployment', () => {
    it('Should check if the contract was deployed', () => {
      expect(lottery?.address).to.exist;
    });
  });

  describe('Playing', () => {
    it('Should enter the lottery', async () => {
      const [account] = await ethers.getSigners();
      lottery?.connect(account);
      const balance = await account.getBalance();
      const tx = await lottery?.enter({
        gasLimit,
        value: ethers.utils.parseEther('0.02'),
      });
      expect(tx).to.emit(lottery, 'PlayedJoined').withArgs(account.address);
      const players = await lottery?.getPlayers();
      expect(players).to.be.an('array').that.contains(account.address);
      const currentBalance = await account.getBalance();
      expect(balance).to.be.greaterThan(currentBalance);
    });

    it('Should return the number of players', async () => {
      const [owner] = await ethers.getSigners();
      await enter();
      const players = await lottery?.connect(owner).getPlayers();
      expect(players).to.have.length(3);
    });

    it('Should return the contract balance', async () => {
      const [account] = await ethers.getSigners();
      const value = ethers.utils.parseEther('10');
      lottery?.connect(account);
      await lottery?.enter({
        gasLimit,
        value,
      });
      const lotteryBalance = await lottery?.balance();
      expect(lotteryBalance).to.be.equal(value);
    });

    it('Should only the contract owner get the list of players', async () => {
      const [owner, account] = await ethers.getSigners();
      await enter();
      await expect(lottery?.connect(account).getPlayers()).to.be.rejectedWith(
        'Not allowed'
      );
      const players = await lottery?.connect(owner).getPlayers();
      expect(players).to.have.length(3);
    });

    it('Should only the contract owner can pick the winner', async () => {
      const [, account] = await ethers.getSigners();
      await enter();
      await expect(lottery?.connect(account).getPlayers()).to.be.rejectedWith(
        'Not allowed'
      );
    });

    it('Should pick a winner', async () => {
      const [, account2] = await ethers.getSigners();
      await lottery?.connect(account2).enter({
        gasLimit,
        value: ethers.utils.parseEther('1'),
      });
      await expect(lottery?.pickWinner())
        .to.emit(lottery, 'Winner')
        .withArgs(account2.address);
    });

    it('Should return the contract balance', async () => {
      await enter();
      const balance = await lottery?.balance();
      expect(balance).to.be.equal(ethers.utils.parseEther('3'));
    });

    it('Should only the owner withdrawal the funds', async () => {
      const [owner, account2] = await ethers.getSigners();
      await enter();
      await expect(lottery?.connect(account2).withdrawal()).to.be.rejected;
      const balanceBefore = await owner.getBalance();
      await lottery?.withdrawal();
      const balanceAfter = await owner.getBalance();
      expect(balanceBefore).to.be.lessThan(balanceAfter);
    });
  });
});
