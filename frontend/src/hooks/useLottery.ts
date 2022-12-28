import { useContext } from 'react';
import { LotteryContext } from '../contexts/LotteryContext';

function useLottery() {
  return useContext(LotteryContext);
}

export default useLottery;
