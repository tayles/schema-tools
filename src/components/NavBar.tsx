import {
  Divider,
  Group,
  MediaQuery,
  NavLink,
  Navbar,
  ScrollArea,
  Text,
} from '@mantine/core';
import {
  IconApiApp,
  IconBraces,
  IconBrandTypescript,
  IconCodePlus,
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
    icon: <IconCodePlus />,
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
    icon: <IconBrandTypescript />,
  },
];

const NavBar = ({ opened = false }: Props) => {
  const { pathname } = useRouter();

  return (
    <Navbar p="md" hiddenBreakpoint="xl" hidden={!opened} width={{ sm: 300 }}>
      <Navbar.Section>
        <p className="select-text text-sm">
          Tools for APIs, JSON Schema and more
        </p>
        <Divider my="sm" />
      </Navbar.Section>
      <Navbar.Section grow component={ScrollArea} mx="-xs" px="xs">
        {navLinks.map((l) => (
          <NavLink
            component={Link}
            color="teal"
            key={l.label}
            label={l.label}
            description={l.description}
            href={l.href}
            icon={l.icon}
            active={pathname === l.href}
          />
        ))}
      </Navbar.Section>
      <MediaQuery smallerThan="md" styles={{ display: 'none' }}>
        <Navbar.Section>
          <Divider my="sm" />
          <Link href="https://cwf.tayles.co.uk" className="select-text">
            <Group className="gap-1">
              <span>A</span>
              <Text
                variant="gradient"
                gradient={{ from: '#ffe460', to: '#ff7519', deg: 90 }}
                fw={700}
              >
                Clockwork Fish
              </Text>
              <span>production</span>
            </Group>
          </Link>
        </Navbar.Section>
      </MediaQuery>
    </Navbar>
  );
};

export default NavBar;
