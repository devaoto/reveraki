import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const Settings = dynamic(() => import('../playerSettings'), { ssr: false });

export default function PlayerSettingsPage() {
  return (
    <Suspense>
      <Settings />
    </Suspense>
  );
}
