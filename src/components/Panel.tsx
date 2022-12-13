interface Props {
  title: string;
  children: React.ReactNode;
}

const Panel = ({ title, children }: Props) => {
  return (
    <section className="flex flex-1 flex-col items-center justify-between rounded-lg bg-white p-4 shadow sm:p-6 xl:p-8">
      <div>
        <h3 className="mb-2 text-xl font-bold">{title}</h3>
        <div></div>
      </div>
      {children}
    </section>
  );
};

export default Panel;
