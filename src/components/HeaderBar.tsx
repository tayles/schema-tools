import {
  Burger,
  Button,
  Group,
  Header,
  MediaQuery,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { IconBrandGithub, IconInfoCircle, IconShare } from '@tabler/icons';

import HeaderButton from './HeaderButton';
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';

interface Props {
  title: string;
  opened: boolean;
  onToggleNavbarOpen: () => void;
}

const HeaderBar = ({ title, opened = false, onToggleNavbarOpen }: Props) => {
  const theme = useMantineTheme();

  return (
    <Header height={{ base: 50, md: 70 }} p="md">
      <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <Burger
          opened={opened}
          onClick={onToggleNavbarOpen}
          size="sm"
          color={theme.colors.gray[6]}
          mr="xl"
        />

        <div className="flex flex-1 items-center justify-between gap-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 -32 576 576"
            width={40}
            height={40}
          >
            <path
              fill="#00A35B"
              d="m290.8 48.6 78.4 29.7-81.2 31.2-81.2-31.2 78.4-29.7c1.8-.7 3.8-.7 5.7 0zM136 92.5v112.2c-1.3.4-2.6.8-3.9 1.3l-96 36.4C14.4 250.6 0 271.5 0 294.7v119.2c0 22.2 13.1 42.3 33.5 51.3l96 42.2c14.4 6.3 30.7 6.3 45.1 0L288 457.5l113.5 49.9c14.4 6.3 30.7 6.3 45.1 0l96-42.2c20.3-8.9 33.5-29.1 33.5-51.3V294.7c0-23.3-14.4-44.1-36.1-52.4l-96-36.4c-1.3-.5-2.6-.9-3.9-1.3V92.5c0-23.3-14.4-44.1-36.1-52.4L308 3.7c-12.8-4.8-26.9-4.8-39.7 0l-96 36.4C150.4 48.4 136 69.3 136 92.5zm256 118.1-82.4 31.2v-89.2L392 121v89.6zm-237.2 40.3 78.4 29.7-81.2 31.1-81.2-31.1 78.4-29.7c1.8-.7 3.8-.7 5.7 0zm18.8 204.4V354.8l82.4-31.6v95.9l-82.4 36.2zm247.6-204.4c1.8-.7 3.8-.7 5.7 0l78.4 29.7-81.3 31.1-81.2-31.1 78.4-29.7zm102 170.3-77.6 34.1V354.8l82.4-31.6v90.7c0 3.2-1.9 6-4.8 7.3z"
            />
          </svg>

          <Link href="/">
            <Title order={1}>Schema Tools</Title>
          </Link>

          <MediaQuery smallerThan="md" styles={{ display: 'none' }}>
            <Title order={2}>{title}</Title>
          </MediaQuery>

          <div className="flex-1" />

          <MediaQuery smallerThan="lg" styles={{ display: 'none' }}>
            <Group>
              <HeaderButton
                href="#"
                icon={<IconShare size={16} />}
                label="Share Link"
              />
              <HeaderButton
                href="/about"
                icon={<IconInfoCircle />}
                label="About"
              />
            </Group>
          </MediaQuery>

          <MediaQuery smallerThan="md" styles={{ display: 'none' }}>
            <Group>
              <HeaderButton
                href="https://github.com/tayles/schema-tools"
                icon={<IconBrandGithub />}
                label="View Source"
              />

              <ThemeToggle />
            </Group>
          </MediaQuery>
        </div>
      </div>
    </Header>
  );
};

export default HeaderBar;
