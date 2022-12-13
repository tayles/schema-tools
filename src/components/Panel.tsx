interface Props {
  title: string;
  children: React.ReactNode;
}

const Panel = ({ title, children }: Props) => {
  return (
    <section className="flex flex-1 flex-col items-center justify-between rounded-lg bg-white p-4 shadow">
      <div>
        <h3 className="mb-2 text-xl font-bold">{title}</h3>
        <div></div>
      </div>
      <div className="flex-1">{children}</div>
    </section>
  );
};

export default Panel;
