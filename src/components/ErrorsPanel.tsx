import { Alert } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons';
import Panel from './Panel';
import { useSchemaStore } from '@/store/state';

const ErrorsPanel = () => {
  const schemaErrors = useSchemaStore((state) => state.schemaErrors);
  const dataErrors = useSchemaStore((state) => state.dataErrors);

  const allErrors = [...schemaErrors, ...dataErrors];

  return (
    <Panel title="Errors">
      <div className="flex flex-col items-stretch gap-2">
        {allErrors.map((error) => (
          <Alert
            key={error.message}
            icon={<IconAlertCircle size={16} />}
            title="Bummer!"
            color="red"
          >
            {error.message}
          </Alert>
        ))}
      </div>
    </Panel>
  );
};

export default ErrorsPanel;
