import {
  Anchor,
  AppShell,
  Burger,
  Footer,
  Header,
  MediaQuery,
  Title,
  useMantineTheme,
} from '@mantine/core';

import ThemeToggle from './ThemeToggle';
import { useState } from 'react';

interface Props {
  title: string;
  children?: React.ReactNode;
}

const Layout = ({ title, children }: Props) => {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);

  return (
    <AppShell
      styles={{
        main: {
          background:
            theme.colorScheme === 'dark'
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      }}
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      // navbar={
      //   <Navbar
      //     p="md"
      //     hiddenBreakpoint="sm"
      //     hidden={!opened}
      //     width={{ sm: 200, lg: 300 }}
      //   >
      //     <Text>Application navbar</Text>
      //   </Navbar>
      // }
      // aside={
      //   <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
      //     <Aside p="md" hiddenBreakpoint="sm" width={{ sm: 200, lg: 300 }}>
      //       <Text>Application sidebar</Text>
      //     </Aside>
      //   </MediaQuery>
      // }
      footer={
        <Footer height={60} p="md">
          Made with ❤️ by{' '}
          <Anchor href="https://cwf.tayles.co.uk">Clockwork Fish</Anchor>
        </Footer>
      }
      header={
        <Header height={{ base: 50, md: 70 }} p="md">
          <div
            style={{ display: 'flex', alignItems: 'center', height: '100%' }}
          >
            <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
              <Burger
                opened={opened}
                onClick={() => setOpened((o) => !o)}
                size="sm"
                color={theme.colors.gray[6]}
                mr="xl"
              />
            </MediaQuery>

            <Title order={1}>Schema Tools</Title>
            <ThemeToggle />
          </div>
        </Header>
      }
    >
      {children}
    </AppShell>
  );
};

export default Layout;
