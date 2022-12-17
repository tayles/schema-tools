import IconButton from './IconButton';
import { IconIndentIncrease } from '@tabler/icons';

const FormatButton = (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <IconButton
      tooltip="Format"
      icon={<IconIndentIncrease size={16} />}
      {...props}
    />
  );
};

export default FormatButton;
