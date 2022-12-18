import { AppShell, useMantineTheme } from '@mantine/core';

import HeaderBar from './HeaderBar';
import NavBar from './NavBar';
import { useState } from 'react';

interface Props {
  title: string;
  children?: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  return (
    <AppShell
      styles={{
        main: {
          display: 'flex',
          background:
            theme.colorScheme === 'dark'
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      }}
      navbarOffsetBreakpoint="xl"
      asideOffsetBreakpoint="sm"
      header={
        <HeaderBar
          opened={opened}
          onToggleNavbarOpen={() => setOpened((o) => !o)}
        />
      }
      navbar={<NavBar opened={opened} />}
      // aside={
      //   <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
      //     <Aside p="md" hiddenBreakpoint="sm" width={{ sm: 200, lg: 300 }}>
      //       <Text>Application sidebar</Text>
      //     </Aside>
      //   </MediaQuery>
      // }
      // footer={
      //   <Footer height={60} p="md">
      //     Made with ❤️ by{' '}
      //     <Anchor href="https://cwf.tayles.co.uk">Clockwork Fish</Anchor>
      //   </Footer>
      // }
    >
      {children}
    </AppShell>
  );
};

export default Layout;
