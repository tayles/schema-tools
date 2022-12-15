interface Props {
  count: number;
}

const ErrorCountBadge = ({ count }: Props) => {
  if (count < 1) {
    return null;
  }

  return (
    <span className="inline-block whitespace-nowrap rounded bg-red-600 py-1 px-2.5 text-center align-baseline text-xs font-bold leading-none text-white">
      {count}
    </span>
  );
};

export default ErrorCountBadge;
