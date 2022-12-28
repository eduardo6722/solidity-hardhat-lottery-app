interface LotteryContextProps {
  account: string | undefined;
  handleConnectWallet: () => Promise<void>;
}
