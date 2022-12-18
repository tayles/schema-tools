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

interface NavLinkDescriptor {
  label: string;
  description: string;
  href: string;
  icon: React.ReactNode;
}

const navLinks: NavLinkDescriptor[] = [
  {
    label: 'JSON Schema Validator',
    description: 'Validate data against a schema',
    href: '/',
    icon: <IconBraces />,
  },
  {
    label: 'YAML <> JSON',
    description: 'Convert between JSON and YAML',
    href: '/yaml-to-json',
    icon: <IconTransform />,
  },
  {
    label: 'JSON Schema Format',
    description: 'Format and sort a schema',
    href: '/json-schema-format',
    icon: <IconIndentIncrease />,
  },
  {
    label: 'API Format',
    description: 'Format and sort an OpenAPI or AsyncAPI schema',
    href: '/openapi-format',
    icon: <IconApiApp />,
  },
  {
    label: 'JSON Format',
    description: 'Format JSON files',
    href: '/json-format',
    icon: <IconIndentIncrease />,
  },
  {
    label: 'YAML Format',
    description: 'Format YAML files',
    href: '/yaml-format',
    icon: <IconIndentIncrease />,
  },
  {
    label: 'JSON Schema to Zod',
    description: 'Convert a json schema to zod TypeScript types',
    href: '/json-schema-to-zod',
    icon: <IconTransform />,
  },
];

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
          {navLinks.map((l) => (
            <NavLink
              component={Link}
              color="violet"
              key={l.label}
              label={l.label}
              description={l.description}
              href={l.href}
              icon={l.icon}
              active={pathname === l.href}
            />
          ))}
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
