import { IconCheck, IconX } from '@tabler/icons-react';

import { Badge } from '@mantine/core';

interface Props {
  valid: boolean;
}

const ValidLabel = ({ valid }: Props) => {
  if (valid) {
    return (
      <Badge color="teal" rightSection={<IconCheck size={16} />}>
        Valid
      </Badge>
    );
  } else {
    return (
      <Badge color="red" variant="filled" rightSection={<IconX size={16} />}>
        Invalid
      </Badge>
    );
  }
};

export default ValidLabel;
