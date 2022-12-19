import { IconMoonStars, IconSun } from '@tabler/icons';
import { Switch, useMantineColorScheme, useMantineTheme } from '@mantine/core';

export function ThemeToggle() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();

  return (
    <Switch
      checked={colorScheme === 'dark'}
      onChange={() => toggleColorScheme()}
      size="lg"
      aria-label="Toggle dark mode"
      onLabel={<IconSun color={theme.white} size={20} stroke={1.5} />}
      offLabel={
        <IconMoonStars color={theme.colors.gray[6]} size={20} stroke={1.5} />
      }
    />
  );
}

export default ThemeToggle;
