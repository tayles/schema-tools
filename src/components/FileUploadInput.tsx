import { ActionIcon, FileButton, Tooltip } from '@mantine/core';

import { IconUpload } from '@tabler/icons';

interface Props {
  onFileLoad: (file?: File) => void;
}

const FileUploadInput = ({ onFileLoad }: Props) => {
  return (
    <FileButton
      onChange={(file) => onFileLoad(file ?? undefined)}
      accept="application/json,text/yaml"
    >
      {(props) => (
        <Tooltip label="Upload a file" withArrow position="top">
          <ActionIcon variant="outline" {...props}>
            <IconUpload size={16} />
          </ActionIcon>
        </Tooltip>
      )}
    </FileButton>
  );
};

export default FileUploadInput;
