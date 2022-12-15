import Panel from './Panel';
import { useSchemaStore } from '@/store/state';

const ErrorsPanel = () => {
  const schemaErrors = useSchemaStore((state) => state.schemaErrors);
  const dataErrors = useSchemaStore((state) => state.dataErrors);

  const allErrors = [...schemaErrors, ...dataErrors];

  return (
    <Panel title="Errors">
      <p>This is where the errors and warnings are displayed</p>
      {allErrors.map((error) => (
        <div key={error.message}>{error.message}</div>
      ))}
    </Panel>
  );
};

export default ErrorsPanel;
