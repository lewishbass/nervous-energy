'use client';

import { useState, useEffect } from 'react';
import { pyodidePool, WorkerInfoPublic } from '@/components/coding/PoolManager';

export function useWorkerList(): WorkerInfoPublic[] {
	const [workers, setWorkers] = useState<WorkerInfoPublic[]>(() => pyodidePool.getAllWorkers());

	useEffect(() => {
		return pyodidePool.subscribeToWorkerList((updated) => {
			setWorkers([...updated]);
		});
	}, []);

	return workers;
}
