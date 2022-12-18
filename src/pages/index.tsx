import { type NextPage } from 'next';
import Layout from '@/components/Layout';
import SchemaPanel from '@/components/SchemaPanel';
import DataPanel from '@/components/DataPanel';
import FileDropzone from '@/components/FileDropzone';

const Home: NextPage = () => {
  return (
    <Layout title="JSON Schema Validator">
      <div className="flex flex-1 flex-wrap justify-around gap-4 text-black">
        <SchemaPanel />
        <DataPanel />
      </div>

      <FileDropzone />
    </Layout>
  );
};

export default Home;
