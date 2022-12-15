import * as ToggleGroup from '@radix-ui/react-toggle-group';

import { useState } from 'react';

interface Props {
  onClick: (button: string) => void;
  buttons: string[];
}

const ButtonGroup = ({ onClick, buttons }: Props) => {
  const [value, setValue] = useState<string>();

  return (
    <ToggleGroup.Root
      type="single"
      defaultValue={value}
      aria-label="Text alignment"
      value={value}
      onValueChange={(value) => {
        if (value) {
          setValue(value);
          onClick(value);
        }
      }}
    >
      {buttons.map((label) => (
        <ToggleGroup.Item
          key={label}
          className="border-y border-gray-200 bg-white px-2.5 py-2 first:rounded-l-md first:border-x last:rounded-r-md last:border-x focus:relative focus:outline-none focus-visible:z-20 focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          value={label}
          aria-label={label}
        >
          {label}
        </ToggleGroup.Item>
      ))}
    </ToggleGroup.Root>
  );
};

export default ButtonGroup;
