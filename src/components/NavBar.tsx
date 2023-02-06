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
} from '@tabler/icons-react';

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
              <span>Made by</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                fill="none"
                viewBox="0 -112.5 577 577"
              >
                <path
                  fill="#ff8200"
                  d="M180.547 61.5c39.2-33 92.1-61.5 155.5-61.5 63.4 0 116.3 28.5 155.5 61.5 39.1 33 66.9 72.4 81 99.8 4.7 9.2 4.7 20.1 0 29.3-14.1 27.4-41.9 66.8-81 99.8-39.2 33.1-92.1 61.6-155.5 61.6-63.4 0-116.3-28.5-155.5-61.5-16.2-13.7-30.5-28.5-42.7-43.1l-89.7 52.2c-12.5 7.3-28.4 5.3-38.7-4.9-10.3-10.2-12.4-26-5.2-38.6l45.8-80.1-45.8-80.1c-7.2-12.6-5-28.4 5.3-38.6 10.3-10.2 26.1-12.2 38.7-4.9l89.7 52.3c12.2-14.6 26.5-29.4 42.7-43.1l-.1-.1Z"
                />
                <g clip-path="url(#a)">
                  <path
                    fill="#cb6015"
                    d="M338.5 316C259.239 316 195 251.761 195 172.5S259.239 29 338.5 29 482 93.239 482 172.5 417.761 316 338.5 316ZM325.047 96.266V172.5c0 4.484 2.242 8.688 5.998 11.211l53.812 35.875c6.166 4.148 14.518 2.466 18.666-3.756 4.148-6.222 2.467-14.518-3.755-18.666l-47.815-31.839v-69.06A13.42 13.42 0 0 0 338.5 82.813a13.42 13.42 0 0 0-13.453 13.454Z"
                  />
                </g>
                <defs>
                  <clipPath id="a">
                    <path
                      fill="#cb6015"
                      d="M0 0h287v287H0z"
                      transform="translate(195 29)"
                    />
                  </clipPath>
                </defs>
              </svg>

              <Text
                variant="gradient"
                gradient={{ from: '#ffe460', to: '#ff7519', deg: 90 }}
                fw={700}
              >
                Clockwork Fish
              </Text>
            </Group>
          </Link>
        </Navbar.Section>
      </MediaQuery>
    </Navbar>
  );
};

export default NavBar;
