import {
  Anchor,
  AppShell,
  Burger,
  Button,
  Divider,
  Group,
  Header,
  MediaQuery,
  NavLink,
  Navbar,
  ScrollArea,
  Title,
  useMantineTheme,
} from '@mantine/core';
import {
  IconApiApp,
  IconBraces,
  IconHeart,
  IconIndentIncrease,
  IconTransform,
} from '@tabler/icons';

import ThemeToggle from './ThemeToggle';
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
      navbar={
        <Navbar
          p="md"
          hiddenBreakpoint="xl"
          hidden={!opened}
          width={{ sm: 300 }}
        >
          <Navbar.Section>
            <p>Tools for APIs, JSON Schema and more</p>
            <Divider my="sm" />
          </Navbar.Section>
          <Navbar.Section grow mt="md">
            <ScrollArea>
              <NavLink
                label="JSON Schema Validator"
                description="Validate data against a schema"
                icon={<IconBraces />}
                active
              />
              <NavLink
                label="JSON Schema Formatter"
                description="Format and sort a schema"
                icon={<IconIndentIncrease />}
              />
              <NavLink
                label="JSON <> YAML"
                description="Convert between JSON and YAML"
                icon={<IconTransform />}
              />
              <NavLink
                label="API Formatter"
                description="Format and sort an OpenAPI or AsyncAPI schema"
                icon={<IconApiApp />}
              />
            </ScrollArea>
          </Navbar.Section>
          <MediaQuery smallerThan="md" styles={{ display: 'none' }}>
            <Navbar.Section>
              <Divider my="sm" />
              <Group spacing="xs">
                <span>Made with</span>
                <IconHeart />
                <span>by</span>
                <Anchor href="https://cwf.tayles.co.uk">Clockwork Fish</Anchor>
              </Group>
            </Navbar.Section>
          </MediaQuery>
        </Navbar>
      }
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
      header={
        <Header height={{ base: 50, md: 70 }} p="md">
          <div
            style={{ display: 'flex', alignItems: 'center', height: '100%' }}
          >
            {/* <MediaQuery largerThan="sm" styles={{ display: 'none' }}> */}
            <Burger
              opened={opened}
              onClick={() => setOpened((o) => !o)}
              size="sm"
              color={theme.colors.gray[6]}
              mr="xl"
            />
            {/* </MediaQuery> */}

            <div className="flex flex-1 items-center justify-between gap-8">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 -32 576 576"
                width={50}
                height={50}
              >
                <path
                  fill="#00A35B"
                  d="m290.8 48.6 78.4 29.7-81.2 31.2-81.2-31.2 78.4-29.7c1.8-.7 3.8-.7 5.7 0zM136 92.5v112.2c-1.3.4-2.6.8-3.9 1.3l-96 36.4C14.4 250.6 0 271.5 0 294.7v119.2c0 22.2 13.1 42.3 33.5 51.3l96 42.2c14.4 6.3 30.7 6.3 45.1 0L288 457.5l113.5 49.9c14.4 6.3 30.7 6.3 45.1 0l96-42.2c20.3-8.9 33.5-29.1 33.5-51.3V294.7c0-23.3-14.4-44.1-36.1-52.4l-96-36.4c-1.3-.5-2.6-.9-3.9-1.3V92.5c0-23.3-14.4-44.1-36.1-52.4L308 3.7c-12.8-4.8-26.9-4.8-39.7 0l-96 36.4C150.4 48.4 136 69.3 136 92.5zm256 118.1-82.4 31.2v-89.2L392 121v89.6zm-237.2 40.3 78.4 29.7-81.2 31.1-81.2-31.1 78.4-29.7c1.8-.7 3.8-.7 5.7 0zm18.8 204.4V354.8l82.4-31.6v95.9l-82.4 36.2zm247.6-204.4c1.8-.7 3.8-.7 5.7 0l78.4 29.7-81.3 31.1-81.2-31.1 78.4-29.7zm102 170.3-77.6 34.1V354.8l82.4-31.6v90.7c0 3.2-1.9 6-4.8 7.3z"
                />
              </svg>

              <Title order={1} className="flex-1">
                Schema Tools
              </Title>

              <MediaQuery smallerThan="md" styles={{ display: 'none' }}>
                <Group>
                  <Button>About</Button>
                  <Button>Source</Button>
                  <ThemeToggle />
                </Group>
              </MediaQuery>
            </div>
          </div>
        </Header>
      }
    >
      {children}
    </AppShell>
  );
};

export default Layout;
