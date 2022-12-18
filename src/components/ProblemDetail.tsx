import { Alert } from '@mantine/core';
import type { ErrorInstance } from '@/utils/model';
import { IconAlertCircle } from '@tabler/icons';
import PrettyPrintJson from './PrettyPrintJson';

interface Props {
  error: ErrorInstance;
}

const ProblemDetail = ({ error }: Props) => {
  return (
    <Alert
      key={error.message}
      icon={<IconAlertCircle size={16} />}
      title={error.keyword}
      color="red"
    >
      <div className="whitespace-pre-wrap">{error.message}</div>
      <PrettyPrintJson data={error} />
    </Alert>
  );
};

export default ProblemDetail;
