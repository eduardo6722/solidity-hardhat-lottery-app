import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import * as dotenv from 'dotenv';

dotenv.config();

const config: HardhatUserConfig = {
  solidity: '0.8.17',
  networks: {
    goerli: {
      accounts: [process.env.WALLET_PRIVATE_KEY as string],
      url: process.env.ALCHEMY_URL,
    },
  },
};

export default config;
