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
