import { Accordion, Card, Group, Stack } from '@mantine/core';

import type { ErrorInstance } from '@/utils/model';
import { IconChevronUp } from '@tabler/icons';
import ProblemCountBadge from './ProblemCountBadge';
import ProblemDetail from './ProblemDetail';
import { useDisclosure } from '@mantine/hooks';
import { useState } from 'react';

interface Props {
  errors: ErrorInstance[];
  onClick: (error: ErrorInstance) => void;
}

const ProblemsPanel = ({ errors, onClick }: Props) => {
  const [opened, handlers] = useDisclosure(true);
  const [manuallyClosed, setManuallyClosed] = useState(false);

  const hasErrors = errors.length > 0;
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
        styles={{
          content: {
            padding: '0 12px 12px 12px',
            overflow: 'scroll',
            maxHeight: '40vh',
          },
          control: {
            paddingTop: 8,
            paddingBottom: 8,
          },
        }}
        value={isOpen ? 'problems' : null}
        onChange={handleChange}
        sx={{ marginBottom: -12, borderTopWidth: 1 }}
      >
        <Accordion.Item value="problems">
          <Accordion.Control disabled={!hasErrors} onClick={handleClick}>
            <Group>
              Problems
              <ProblemCountBadge count={errors?.length} />
            </Group>
          </Accordion.Control>
          <Accordion.Panel>
            <Stack>
              {errors.map((error) => (
                <ProblemDetail
                  key={error.message}
                  error={error}
                  onClick={() => onClick(error)}
                />
              ))}
            </Stack>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Card.Section>
  );
};

export default ProblemsPanel;
