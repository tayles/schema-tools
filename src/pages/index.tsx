import { type NextPage } from 'next';
import Layout from '@/components/Layout';
import SchemaPanel from '@/components/SchemaPanel';
import DataPanel from '@/components/DataPanel';
import Head from 'next/head';

const Home: NextPage = () => {
  return (
    <Layout title="Schema Tools">
      <Head>
        <title>Schema Tools</title>
      </Head>

      <div className="relative flex-1">
        <div className="absolute inset-0 flex">
          <div className="mx-4 flex flex-1 flex-wrap gap-4 text-black">
            <SchemaPanel />
            <DataPanel />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
