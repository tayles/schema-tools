import Head from 'next/head';
import Header from '@/components/Header';
import { Suspense } from 'react';

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
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <Suspense fallback={'Loading...'}>
            <Header title={title} />
          </Suspense>
          {children}
        </div>
      </main>
    </>
  );
};

export default Layout;
