import { IconCircleCheck, IconX } from '@tabler/icons';

import { Badge } from '@mantine/core';

interface Props {
  valid: boolean;
}

const ValidLabel = ({ valid }: Props) => {
  if (valid) {
    return (
      <Badge color="teal" leftSection={<IconCircleCheck size={16} />}>
        Valid
      </Badge>
    );
  } else {
    return (
      <Badge color="red" variant="filled" leftSection={<IconX size={16} />}>
        Invalid
      </Badge>
    );
  }
};

export default ValidLabel;
