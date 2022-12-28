import { Button, Flex, Stack } from '@chakra-ui/react';
import Head from 'next/head';
import useLottery from '../hooks/useLottery';

export default function Home() {
  const { handleConnectWallet, account } = useLottery();
  return (
    <>
      <Head>
        <title>ETH Lottery</title>
        <meta name='description' content='Ether Lottery App' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Stack width='100%' minHeight='calc(100vh - 40px)' placeContent='center'>
        <Flex justifyContent='center'>
          <Button
            onClick={() => (!account ? handleConnectWallet() : undefined)}
            colorScheme={account ? 'green' : undefined}
          >
            {`${
              account
                ? `Connected: ${account.slice(0, 8)}...`
                : 'Connect wallet'
            }`}
          </Button>
        </Flex>
      </Stack>
    </>
  );
}
