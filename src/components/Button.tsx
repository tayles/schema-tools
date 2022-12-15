interface Props {
  onClick: () => void;
  children: React.ReactNode;
}

const Button = ({ onClick, children }: Props) => {
  return (
    <button
      onClick={onClick}
      className="rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700"
    >
      {children}
    </button>
  );
};

export default Button;
