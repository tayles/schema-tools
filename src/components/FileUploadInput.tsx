interface Props {
  onFileLoad: (file?: File) => void;
}

const FileUploadInput = ({ onFileLoad }: Props) => {
  return (
    <input
      className="form-control m-0 block w-full rounded border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-1.5 text-base font-normal text-gray-700 transition ease-in-out focus:border-blue-600 focus:bg-white focus:text-gray-700 focus:outline-none"
      id="fileInput"
      type="file"
      onChange={(e) => onFileLoad(e.target.files?.[0])}
    ></input>
  );
};

export default FileUploadInput;
