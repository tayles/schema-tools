import { type NextPage } from 'next';
import Layout from '@/components/Layout';
import JsonPanel from '@/components/JsonPanel';
import YamlPanel from '@/components/YamlPanel';
import FileDropzone from '@/components/FileDropzone';

const YamlToJsonPage: NextPage = () => {
  return (
    <Layout title="YAML to JSON">
      <div className="flex flex-1 flex-wrap justify-around gap-4 text-black">
        <YamlPanel />
        <JsonPanel />
      </div>

      <FileDropzone />
    </Layout>
  );
};

export default YamlToJsonPage;
