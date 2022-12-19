import { Button } from '@mantine/core';
import Link from 'next/link';

interface Props {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const HeaderButton = ({ label, href, icon }: Props) => {
  return (
    <Button component={Link} href={href} leftIcon={icon} variant="default">
      {label}
    </Button>
  );
};

export default HeaderButton;
