import { Card } from '@mantine/core';

interface Props {
  title: string;
  children: React.ReactNode;
}

const Panel = ({ title, children }: Props) => {
  return (
    <Card
      shadow="sm"
      p="sm"
      radius="md"
      withBorder
      sx={{ display: 'flex', flex: 1, minWidth: '400px', minHeight: '300px' }}
    >
      {children}
    </Card>
  );
};

export default Panel;
