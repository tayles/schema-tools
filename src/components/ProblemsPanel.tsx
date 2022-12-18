import { Accordion, Card, Group, Stack } from '@mantine/core';

import type { ErrorInstance } from '@/utils/model';
import { IconChevronUp } from '@tabler/icons';
import ProblemCountBadge from './ProblemCountBadge';
import ProblemDetail from './ProblemDetail';
import { useDisclosure } from '@mantine/hooks';
import { useState } from 'react';

interface Props {
  errors: ErrorInstance[];
}

const ProblemsPanel = ({ errors }: Props) => {
  const hasErrors = errors.length > 0;

  const [opened, handlers] = useDisclosure(true);
  const [manuallyClosed, setManuallyClosed] = useState(false);

  const isOpen = hasErrors && (!manuallyClosed || opened);

  const handleClick = () => {
    handlers.close();
    if (opened && hasErrors) {
      setManuallyClosed(true);
    }
  };

  const handleChange = () => {
    handlers.toggle();
  };

  return (
    <Card.Section>
      <Accordion
        chevron={<IconChevronUp size={16} />}
        value={isOpen ? 'problems' : null}
        onChange={handleChange}
        sx={{ marginBottom: '-12px' }}
      >
        <Accordion.Item
          onClick={handleClick}
          value="problems"
          sx={{ borderBottom: 'none' }}
        >
          <Accordion.Control color="red" disabled={!hasErrors}>
            <Group>
              Problems
              <ProblemCountBadge count={errors?.length} />
            </Group>
          </Accordion.Control>
          <Accordion.Panel>
            <Stack>
              {errors.map((error) => (
                <ProblemDetail key={error.message} error={error} />
              ))}
            </Stack>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Card.Section>
  );
};

export default ProblemsPanel;
