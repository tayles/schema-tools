import { type AppType } from 'next/app';
import { useState } from 'react';
import Head from 'next/head';
import {
  MantineProvider,
  ColorSchemeProvider,
  type ColorScheme,
} from '@mantine/core';
import { trpc } from '@/utils/trpc';
import '@/styles/globals.css';
import WorkerManager from '@/components/WorkerManager';

const MyApp: AppType = ({ Component, pageProps }) => {
  const [colorScheme, setColorScheme] = useState<ColorScheme>('light');
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider withGlobalStyles theme={{ colorScheme }}>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />

          <link
            rel="apple-touch-icon"
            sizes="57x57"
            href="/icons/favicon-57x57.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="60x60"
            href="/icons/favicon-60x60.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="72x72"
            href="/icons/favicon-72x72.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="76x76"
            href="/icons/favicon-76x76.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="114x114"
            href="/icons/favicon-114x114.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="120x120"
            href="/icons/favicon-120x120.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="144x144"
            href="/icons/favicon-144x144.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="152x152"
            href="/icons/favicon-152x152.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/icons/favicon-180x180.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/icons/favicon-16x16.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/icons/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="96x96"
            href="/icons/favicon-96x96.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="192x192"
            href="/icons/favicon-192x192.png"
          />
          <link rel="shortcut icon" type="image/x-icon" href="/favicon.ico" />
          <link rel="icon" type="image/x-icon" href="/favicon.ico" />
          <meta name="msapplication-TileColor" content="#2B5797" />
          <meta
            name="msapplication-TileImage"
            content="/icons/favicon-144x144.png"
          />
          <meta name="msapplication-config" content="/browserconfig.xml" />
          <link rel="icon" type="image/svg+xml" href="/icons/favicon.svg" />
          <meta name="theme-color" content="#00a35b" />

          <meta
            name="description"
            content="Tools for APIs, JSON Schemas and more"
          />
          <meta name="application-name" content="Schema Tools" />
          <meta name="apple-mobile-web-app-title" content="Schema Tools" />

          <meta name="twitter:card" content="summary" />
          <meta
            name="twitter:url"
            content="https://schema-tools.tayles.co.uk"
          />
          <meta name="twitter:title" content="Schema Tools" />
          <meta
            name="twitter:description"
            content="Tools for APIs, JSON Schema and more"
          />
          <meta
            name="twitter:image"
            content="https://schema-tools.tayles.co.uk/img/schema-tools-opengraph.png"
          />
          <meta name="twitter:creator" content="@tayles" />
          <meta property="og:type" content="website" />
          <meta property="og:title" content="Schema Tools" />
          <meta
            property="og:description"
            content="Tools for APIs, JSON Schema and more"
          />
          <meta property="og:site_name" content="Schema Tools" />
          <meta property="og:url" content="https://schema-tools.tayles.co.uk" />
          <meta
            property="og:image"
            content="https://schema-tools.tayles.co.uk/img/schema-tools-opengraph.png"
          />
        </Head>
        <Component {...pageProps} />
        <WorkerManager />
      </MantineProvider>
    </ColorSchemeProvider>
  );
};

export default trpc.withTRPC(MyApp);
