import { IconAlertCircle, IconEye, IconLink } from '@tabler/icons';

import { Alert } from '@mantine/core';
import type { ErrorInstance } from '@/utils/model';
import PrettyPrintJson from './PrettyPrintJson';

interface Props {
  error: ErrorInstance;
  onClick: () => void;
}

const ProblemDetail = ({ error, onClick }: Props) => {
  const color = error.severity === 'error' ? 'red' : 'orange';
  return (
    <Alert
      key={error.message}
      icon={<IconAlertCircle size={16} />}
      title={error.keyword}
      color={color}
      className="cursor-pointer"
      sx={{ userSelect: 'text' }}
      onClick={onClick}
    >
      <div className="whitespace-pre-wrap">{error.message}</div>
      {/* <PrettyPrintJson data={error} /> */}
      {error.pointer && <IconEye size={16} />}
      {error.markerLocation && <IconLink size={16} />}
    </Alert>
  );
};

export default ProblemDetail;
