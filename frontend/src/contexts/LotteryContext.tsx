import { useToast } from '@chakra-ui/react';
import { ethers } from 'ethers';
import { createContext, useCallback, useEffect, useState } from 'react';
import { CONTRACT_ABI, CONTRACT_ADDRESS } from '../config/contract';

export const LotteryContext = createContext<LotteryContextProps>(
  {} as LotteryContextProps
);

function LotteryProvider({ children }) {
  const [metamask, setMetamask] = useState<any>(null);
  const [account, setAccount] = useState<string>();

  const toast = useToast();

  const getContract = useCallback(() => {
    if (!metamask) return;
    const provider = new ethers.providers.Web3Provider(metamask);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      CONTRACT_ABI,
      signer
    );
    return contract;
  }, [metamask]);

  const handleConnectWallet = useCallback(async () => {
    if (!metamask) {
      toast({
        title: 'Please, install Metamask!',
        position: 'top-right',
        status: 'info',
      });
      return;
    }
    const accounts = await metamask.request({ method: 'eth_requestAccounts' });
    if (accounts?.length) {
      setAccount(accounts[0]);
    }
  }, [metamask, toast]);

  const joinLottery = useCallback(async () => {
    const contract = getContract();
    await contract?.enter({
      gasLimit: 520000,
      value: ethers.utils.parseEther('0.11'),
    });
  }, [getContract]);

  useEffect(() => {
    if (window && (window as any)?.ethereum) {
      setMetamask((window as any).ethereum);
    }
  }, []);

  useEffect(() => {
    async function fetchWallet() {
      const accounts = await metamask.request({ method: 'eth_accounts' });
      if (accounts?.length) {
        setAccount(accounts[0]);
      }
    }
    if (metamask) {
      fetchWallet();
    }
  }, [metamask]);

  return (
    <LotteryContext.Provider
      value={{ account, handleConnectWallet, joinLottery }}
    >
      {children}
    </LotteryContext.Provider>
  );
}

export default LotteryProvider;
