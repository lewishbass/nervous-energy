'use client';
import { useMemo } from 'react';
import Discussion from '@/components/messages/Discussion';

const THREAD_NAME = "python-automation-discussions";

export default function DiscussionsTab() {
  const baseThreadID = useMemo(() => {
    if (typeof window !== 'undefined') {
      return THREAD_NAME.toLowerCase().replace(/\s+/g, '-') + '-' + window.location.pathname.replace(/\/+/g, '-').replace(/[^a-z0-9\-]/g, '');
    }
    return THREAD_NAME.toLowerCase().replace(/\s+/g, '-');
  }, []);

  return <Discussion
    baseThreadID={baseThreadID}
    baseThreadTitle="Python-Automation Discussions"
    baseThreadContent="Discuss Python and automation techniques with your classmates here!"
  />;
}
