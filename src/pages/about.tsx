import { type NextPage } from 'next';
import Layout from '@/components/Layout';
import { Anchor, Card, Space, Table } from '@mantine/core';

interface Dependency {
  name: string;
  url: string;
  notes?: string;
}

const dependencies: Dependency[] = [
  {
    name: 'TypeScript',
    url: 'https://www.typescriptlang.org',
    notes: "Couldn't live without it",
  },
  {
    name: 'create t3-app',
    url: 'https://create.t3.gg',
    notes: 'Full-stack, typesafe Next.js app',
  },
  {
    name: 'monaco-editor',
    url: 'https://microsoft.github.io/monaco-editor',
    notes: 'Code editor',
  },
  {
    name: 'js-yaml',
    url: 'https://www.npmjs.com/package/js-yaml',
    notes: 'JSON to YAML converter',
  },
  { name: 'ajv', url: 'https://ajv.js.org', notes: 'Json schema validator' },
  {
    name: 'mantine',
    url: 'https://mantine.dev',
    notes: 'UI component library',
  },
  {
    name: '@tabler/icons-react',
    url: 'https://tabler-icons.io',
    notes: 'Icon collection',
  },
  { name: 'tRPC', url: 'https://trpc.io', notes: 'Typesafe APIs' },
  {
    name: 'json-schema-faker',
    url: 'https://www.npmjs.com/package/json-schema-faker',
    notes: 'Generate example data from a schema',
  },
  {
    name: 'json-source-map',
    url: 'https://www.npmjs.com/package/json-source-map',
    notes: 'Calculate JSON pointers for a document',
  },
  {
    name: 'to-json-schema',
    url: 'https://www.npmjs.com/package/to-json-schema',
    notes: 'Generate schema from data',
  },
  {
    name: 'zustand',
    url: 'https://www.npmjs.com/package/zustand',
    notes: 'Minimal state management',
  },
  { name: 'prettier', url: 'https://prettier.io', notes: 'Code formatting' },
  {
    name: 'tailwindcss',
    url: 'https://tailwindcss.com',
    notes: 'CSS framework',
  },
  {
    name: 'Web Workers API',
    url: 'https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers',
    notes: 'Background threads for more performant UIs',
  },
  {
    name: 'Vercel',
    url: 'https://vercel.com',
    notes: 'Web hosting',
  },
];

const AboutPage: NextPage = () => {
  const rows = dependencies.map((dep) => (
    <tr key={dep.name}>
      <td>
        <Anchor href={dep.url}>{dep.name}</Anchor>
      </td>
      <td>{dep.notes}</td>
    </tr>
  ));

  return (
    <Layout title="About">
      <Card shadow="sm" p="lg" radius="md" withBorder className="select-text">
        <p>
          This site is made possible by these awesome libraries, frameworks,
          technologies and services:
        </p>
        <Space h="lg" />
        <Table>
          <thead>
            <tr>
              <th>Dependency</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </Card>
    </Layout>
  );
};

export default AboutPage;
