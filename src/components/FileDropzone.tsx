import { Center, Group, Text, useMantineTheme } from '@mantine/core';
import { IconCodePlus, IconUpload, IconX } from '@tabler/icons';

import { Dropzone } from '@mantine/dropzone';
import { useSchemaStore } from '@/store/state';
import { useState } from 'react';

const FileDropzone = () => {
  const [active] = useState(true);
  const theme = useMantineTheme();
  const setRawSchema = useSchemaStore((state) => state.setRawSchema);

  const maxSizeBytes = 3 * 1024 ** 2;

  const handleFileDrop = async (files: File[]) => {
    console.log(files);
    const file = files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) =>
        setRawSchema((event.target?.result as string) ?? ''); // desired file content
      // reader.onerror = (error) => reject(error);
      reader.readAsText(file); // you could also read images and other binaries
    }
  };

  return (
    <Dropzone.FullScreen
      onDrop={handleFileDrop}
      onReject={(files) => console.log('rejected files', files)}
      maxSize={maxSizeBytes}
      active={active}
      multiple={false}
      accept={['application/json', 'text/yaml']}
      styles={{
        inner: {
          display: 'flex',
          height: '100%',
        },
      }}
    >
      <Center className="flex-1">
        <Group>
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
            <IconCodePlus size={50} stroke={1.5} />
          </Dropzone.Idle>

          <div>
            <Text size="xl" inline>
              Drag a file here or click to select a file from your computer
            </Text>
            <Text size="sm" color="dimmed" inline mt={7}>
              Accepted file types are: JSON, YAML
            </Text>
          </div>
        </Group>
      </Center>
    </Dropzone.FullScreen>
  );
};

export default FileDropzone;
