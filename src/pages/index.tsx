import { type NextPage } from 'next';
import Layout from '@/components/Layout';
import SchemaPanel from '@/components/SchemaPanel';
import DataPanel from '@/components/DataPanel';
import ErrorsPanel from '@/components/ErrorsPanel';

const Home: NextPage = () => {
  return (
    <Layout title="Schema Tools">
      <div className="flex gap-8 text-black">
        <SchemaPanel />
        <DataPanel />
        <ErrorsPanel />
      </div>
    </Layout>
  );
};

export default Home;
