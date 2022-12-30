import contract from '../../../solidity/artifacts/contracts/Lottery.sol/Lottery.json';

export const CONTRACT_ABI = contract.abi;
export const CONTRACT_ADDRESS = process.env
  .NEXT_PUBLIC_CONTRACT_ADDRESS as string;
