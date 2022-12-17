import { type AppType } from 'next/app';
import { MantineProvider } from '@mantine/core';

import { trpc } from '@/utils/trpc';
import '@/styles/globals.css';

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <MantineProvider
      withGlobalStyles
      theme={{
        colorScheme: 'light',
      }}
    >
      <Component {...pageProps} />
    </MantineProvider>
  );
};

export default trpc.withTRPC(MyApp);
