import type { WorkerResult } from '@/workers/worker-thread';
import { useEffect } from 'react';
import { useSchemaStore } from '@/store/state';

const WorkerManager = () => {
  const workerRef = useSchemaStore((state) => state.workerRef);
  const gotWorkerMessage = useSchemaStore((state) => state.gotWorkerMessage);

  // setup communication with worker thread
  useEffect(() => {
    workerRef.current = new Worker(
      new URL('../workers/worker-thread.ts', import.meta.url),
    );
    workerRef.current.onmessage = (event: MessageEvent<WorkerResult>) => {
      const result = event.data;
      console.log(':: UI Thread IN', result);
      gotWorkerMessage(result);
    };
    return () => {
      workerRef.current?.terminate();
    };
  }, [workerRef, gotWorkerMessage]);

  return <div></div>;
};

export default WorkerManager;
