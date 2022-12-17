import { ActionIcon, CopyButton, Tooltip } from '@mantine/core';
import { IconCheck, IconCopy } from '@tabler/icons';

import type { Thing } from '@/utils/model';

interface Props {
  thing: Thing;
  text: string;
}

const CopyToClipboardButton = ({ thing, text }: Props) => {
  return (
    <CopyButton value={text} timeout={2000}>
      {({ copied, copy }) => (
        <Tooltip
          label={copied ? 'Copied' : `Copy ${thing} to clipboard`}
          withArrow
          position="top"
        >
          <ActionIcon
            variant="outline"
            color={copied ? 'teal' : 'gray'}
            onClick={copy}
          >
            {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
          </ActionIcon>
        </Tooltip>
      )}
    </CopyButton>
  );
};

export default CopyToClipboardButton;
