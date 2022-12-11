interface Props {
  title: string;
}

const Header = ({ title }: Props) => {
  return (
    <header>
      <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
        {title}
      </h1>
    </header>
  );
};

export default Header;
