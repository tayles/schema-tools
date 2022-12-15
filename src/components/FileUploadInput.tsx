interface Props {
  onFileLoad: (file?: File) => void;
}

const FileUploadInput = ({ onFileLoad }: Props) => {
  return (
    <input type="file" onChange={(e) => onFileLoad(e.target.files?.[0])} />
  );
};

export default FileUploadInput;
