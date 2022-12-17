import { FileButton } from '@mantine/core';
import IconButton from './IconButton';
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
        <IconButton
          tooltip="Upload a file"
          icon={<IconUpload size={16} {...props} />}
        />
      )}
    </FileButton>
  );
};

export default FileUploadInput;
