interface Props {
  onClick: (button: string) => void;
  buttons: string[];
}

const ButtonGroup = ({ onClick, buttons }: Props) => {
  return (
    <div className="flex justify-center">
      {buttons.map((label) => (
        <div
          key={label}
          className="form-check form-check-inline"
          onClick={() => onClick(label)}
        >
          <input
            className="form-check-input form-check-input float-left mt-1 mr-2 h-4 w-4 cursor-pointer appearance-none rounded-full border border-gray-300 bg-white bg-contain bg-center bg-no-repeat align-top transition duration-200 checked:border-blue-600 checked:bg-blue-600 focus:outline-none"
            type="radio"
            name="inlineRadioOptions"
            id={label}
            value={label}
          />
          <label
            className="form-check-label inline-block cursor-pointer text-gray-800"
            htmlFor={label}
          >
            {label}
          </label>
        </div>
      ))}
    </div>
  );
};

export default ButtonGroup;
