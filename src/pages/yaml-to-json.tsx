import { type NextPage } from 'next';
import Layout from '@/components/Layout';
import JsonPanel from '@/components/JsonPanel';
import YamlPanel from '@/components/YamlPanel';
import Head from 'next/head';
import FileDropzone from '@/components/FileDropzone';

const Home: NextPage = () => {
  return (
    <Layout title="Schema Tools">
      <Head>
        <title>Yaml to Json</title>
      </Head>

      <div className="flex flex-1 flex-wrap justify-around gap-4 text-black">
        <YamlPanel />
        <JsonPanel />
      </div>

      <FileDropzone />
    </Layout>
  );
};

export default Home;
