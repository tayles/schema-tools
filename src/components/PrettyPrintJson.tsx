interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}

const PrettyPrintJson = ({ data }: Props) => {
  return (
    <div>
      <pre className="whitespace-pre-wrap text-xs">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
};

export default PrettyPrintJson;
