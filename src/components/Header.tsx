interface Props {
  title: string;
}

const Header = ({ title }: Props) => {
  return (
    <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
      {title}
    </h1>
  );
};

export default Header;