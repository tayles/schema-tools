import { useEffect, useRef } from 'react';

import type { WorkerResult } from '@/workers/worker-thread';
import { useSchemaStore } from '@/store/state';

const WorkerManager = () => {
  const setWorkerRef = useSchemaStore((state) => state.setWorkerRef);
  const gotWorkerMessage = useSchemaStore((state) => state.gotWorkerMessage);

  const workerRef = useRef<Worker>();
  setWorkerRef(workerRef);

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
