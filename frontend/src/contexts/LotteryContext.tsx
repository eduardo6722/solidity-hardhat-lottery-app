import { useToast } from '@chakra-ui/react';
import { createContext, useCallback, useEffect, useState } from 'react';

export const LotteryContext = createContext<LotteryContextProps>(
  {} as LotteryContextProps
);

function LotteryProvider({ children }) {
  const [metamask, setMetamask] = useState<any>(null);
  const [account, setAccount] = useState<string>();

  const toast = useToast();

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
    <LotteryContext.Provider value={{ account, handleConnectWallet }}>
      {children}
    </LotteryContext.Provider>
  );
}

export default LotteryProvider;
