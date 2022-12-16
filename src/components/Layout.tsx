import Head from 'next/head';
import Header from '@/components/Header';
import Link from 'next/link';

interface Props {
  title: string;
  children?: React.ReactNode;
}

const Layout = ({ title, children }: Props) => {
  return (
    <>
      <Head>
        <title>Schema Tools</title>
        <meta
          name="description"
          content="Tools for APIs, JSON Schemas and more"
        />
        <link rel="icon" href="/favicon.ico" />

        <meta name="application-name" content="Schema Tools" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Schema Tools" />
        <meta
          name="description"
          content="Tools for APIs, JSON Schema and more"
        />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/icons/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#2B5797" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#000000" />

        <link rel="apple-touch-icon" href="/icons/touch-icon-iphone.png" />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="/icons/touch-icon-ipad.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/icons/touch-icon-iphone-retina.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="167x167"
          href="/icons/touch-icon-ipad-retina.png"
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
          sizes="16x16"
          href="/icons/favicon-16x16.png"
        />
        <link rel="manifest" href="/manifest.json" />
        <link
          rel="mask-icon"
          href="/icons/safari-pinned-tab.svg"
          color="#5bbad5"
        />
        <link rel="shortcut icon" href="/favicon.ico" />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:url" content="https://schema-tools.tayles.co.uk" />
        <meta name="twitter:title" content="Schema Tools" />
        <meta
          name="twitter:description"
          content="Tools for APIs, JSON Schema and more"
        />
        <meta
          name="twitter:image"
          content="https://schema-tools.tayles.co.uk/icons/android-chrome-192x192.png"
        />
        <meta name="twitter:creator" content="@DavidWShadow" />
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
          content="https://schema-tools.tayles.co.uk/icons/apple-touch-icon.png"
        />
      </Head>

      <div className="flex min-h-screen flex-col items-stretch bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <Header title={title} />

        <main className="flex flex-1 flex-col justify-center">{children}</main>

        <footer className="p-4 text-right">
          Made with ❤️ by{' '}
          <Link href="https://cwf.tayles.co.uk">Clockwork Fish</Link>
        </footer>
      </div>
    </>
  );
};

export default Layout;
