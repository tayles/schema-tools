import { Accordion, Alert, Group, Stack } from '@mantine/core';
import { IconAlertCircle, IconChevronUp } from '@tabler/icons';

import ErrorCountBadge from './ErrorCountBadge';
import type { ErrorInstance } from '@/utils/model';
import PrettyPrintJson from './PrettyPrintJson';

interface Props {
  errors: ErrorInstance[];
}

const ProblemsPanel = ({ errors }: Props) => {
  const hasErrors = errors.length > 0;
  return (
    <Accordion
      value={hasErrors ? 'problems' : ''}
      chevron={<IconChevronUp size={16} />}
    >
      <Accordion.Item value="problems">
        <Accordion.Control color="red" disabled={!hasErrors}>
          <Group>
            Problems
            <ErrorCountBadge count={errors?.length} />
          </Group>
        </Accordion.Control>
        <Accordion.Panel>
          <Stack>
            {errors.map((error) => (
              <Alert
                key={error.message}
                icon={<IconAlertCircle size={16} />}
                title={error.keyword}
                color="red"
              >
                <div className="whitespace-pre">{error.message}</div>
                <PrettyPrintJson data={error} />
              </Alert>
            ))}
          </Stack>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
};

export default ProblemsPanel;
