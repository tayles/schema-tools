interface Props {
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const Button = ({ onClick, children, disabled = false }: Props) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className="rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700 disabled:opacity-50"
    >
      {children}
    </button>
  );
};

export default Button;
