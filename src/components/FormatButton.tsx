import { ActionIcon, Tooltip } from '@mantine/core';

import { IconIndentIncrease } from '@tabler/icons';

const FormatButton = (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <Tooltip label="Format" withArrow position="top">
      <ActionIcon variant="outline" {...props}>
        <IconIndentIncrease size={16} />
      </ActionIcon>
    </Tooltip>
  );
};

export default FormatButton;
