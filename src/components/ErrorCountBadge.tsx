import { Badge } from '@mantine/core';

interface Props {
  count: number;
}

const ErrorCountBadge = ({ count }: Props) => {
  if (count < 1) {
    return (
      <Badge color="gray" radius="sm">
        {count}
      </Badge>
    );
  }

  return (
    <Badge color="red" radius="sm" variant="filled">
      {count}
    </Badge>
  );
};

export default ErrorCountBadge;
