import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const Settings = dynamic(() => import('../homeSettings'), { ssr: false });

export default function HomeSettingsPage() {
  return (
    <Suspense>
      <Settings />
    </Suspense>
  );
}
