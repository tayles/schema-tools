import {
  Anchor,
  Divider,
  Group,
  MediaQuery,
  NavLink,
  Navbar,
  ScrollArea,
} from '@mantine/core';
import {
  IconApiApp,
  IconBraces,
  IconHeart,
  IconIndentIncrease,
  IconTransform,
} from '@tabler/icons';

import Link from 'next/link';
import { useRouter } from 'next/router';

interface Props {
  opened: boolean;
}

const NavBar = ({ opened = false }: Props) => {
  const { pathname } = useRouter();

  return (
    <Navbar p="md" hiddenBreakpoint="xl" hidden={!opened} width={{ sm: 300 }}>
      <Navbar.Section>
        <p>Tools for APIs, JSON Schema and more</p>
        <Divider my="sm" />
      </Navbar.Section>
      <Navbar.Section grow mt="md">
        <ScrollArea>
          <NavLink
            label="JSON Schema Validator"
            description="Validate data against a schema"
            component={Link}
            href="/"
            active={pathname === '/'}
            icon={<IconBraces />}
          />
          <NavLink
            label="JSON <> YAML"
            description="Convert between JSON and YAML"
            component={Link}
            href="/yaml-to-json"
            active={pathname === '/yaml-to-json'}
            icon={<IconTransform />}
          />
          <NavLink
            label="JSON Schema Formatter"
            description="Format and sort a schema"
            component={Link}
            href="/json-schema-format"
            icon={<IconIndentIncrease />}
          />
          <NavLink
            label="API Formatter"
            description="Format and sort an OpenAPI or AsyncAPI schema"
            component={Link}
            href="/openapi-format"
            icon={<IconApiApp />}
          />
          <NavLink
            label="JSON Formatter"
            description="Format JSON files"
            component={Link}
            href="/json-format"
            icon={<IconIndentIncrease />}
          />
          <NavLink
            label="YAML Formatter"
            description="Format YAML files"
            component={Link}
            href="/yaml-format"
            icon={<IconIndentIncrease />}
          />
        </ScrollArea>
      </Navbar.Section>
      <MediaQuery smallerThan="md" styles={{ display: 'none' }}>
        <Navbar.Section>
          <Divider my="sm" />
          <Group spacing="xs">
            <span>Made with</span>
            <IconHeart color="red" />
            <span>by</span>
            <Anchor
              component={Link}
              variant="gradient"
              href="https://cwf.tayles.co.uk"
              gradient={{ from: '#ffe460', to: '#ff7519', deg: 90 }}
              fw={700}
            >
              Clockwork Fish
            </Anchor>
          </Group>
        </Navbar.Section>
      </MediaQuery>
    </Navbar>
  );
};

export default NavBar;
