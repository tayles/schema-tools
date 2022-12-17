import { Group, Text, useMantineTheme } from '@mantine/core';
import { IconPhoto, IconUpload, IconX } from '@tabler/icons';

import { Dropzone } from '@mantine/dropzone';
import { useState } from 'react';

const FileDropzone = () => {
  const [active, setActive] = useState(true);
  const theme = useMantineTheme();

  return (
    <Dropzone.FullScreen
      active={active}
      accept={['application/json', 'text/yaml']}
      onDrop={(files) => {
        console.log(files);
        setActive(false);
      }}
    >
      <Group
        position="center"
        spacing="xl"
        style={{ minHeight: 220, pointerEvents: 'none' }}
      >
        <Dropzone.Accept>
          <IconUpload size={50} stroke={1.5} />
        </Dropzone.Accept>
        <Dropzone.Reject>
          <IconX
            size={50}
            stroke={1.5}
            color={theme.colors.red[theme.colorScheme === 'dark' ? 4 : 6]}
          />
        </Dropzone.Reject>
        <Dropzone.Idle>
          <IconPhoto size={50} stroke={1.5} />
        </Dropzone.Idle>

        <div>
          <Text size="xl" inline>
            Drag images here or click to select files
          </Text>
          <Text size="sm" color="dimmed" inline mt={7}>
            Attach as many files as you like, each file should not exceed 5mb
          </Text>
        </div>
      </Group>
    </Dropzone.FullScreen>
  );
};

export default FileDropzone;
