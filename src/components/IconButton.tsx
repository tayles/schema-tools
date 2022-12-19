import { ActionIcon, Tooltip } from '@mantine/core';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  tooltip: string;
  icon: React.ReactNode;
}

const IconButton = ({ tooltip, icon, ...rest }: Props) => {
  return (
    <Tooltip label={tooltip} withArrow position="top">
      <ActionIcon variant="outline" {...rest} aria-label={tooltip}>
        {icon}
      </ActionIcon>
    </Tooltip>
  );
};

export default IconButton;
