interface Props {
  title: string;
}

const Header = ({ title }: Props) => {
  return (
    <header>
      <h1 className="leading-1 p-4 text-4xl font-extrabold tracking-tight text-white">
        {title}
      </h1>
    </header>
  );
};

export default Header;
