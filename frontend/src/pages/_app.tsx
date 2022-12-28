import { ChakraProvider } from '@chakra-ui/react';
import type { AppProps } from 'next/app';
import LotteryProvider from '../contexts/LotteryContext';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <LotteryProvider>
        <Component {...pageProps} />;
      </LotteryProvider>
    </ChakraProvider>
  );
}
