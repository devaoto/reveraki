'use client';

import { useState, useEffect } from 'react';
import { BreadcrumbItem, Breadcrumbs, Switch } from '@nextui-org/react';

export default function Settings() {
  const [autoskip, setAutoskip] = useState(
    () => localStorage.getItem('autoSkip') || 'off',
  );
  const [showbtns, setShowbtns] = useState(
    () => localStorage.getItem('showbtns') || 'off',
  );

  useEffect(() => {
    localStorage.setItem('autoSkip', autoskip);
  }, [autoskip]);

  useEffect(() => {
    localStorage.setItem('showbtns', showbtns);
  }, [showbtns]);

  const handleAutoskipChange = () => {
    setAutoskip(autoskip === 'on' ? 'off' : 'on');
  };

  const handleShowbtnsChange = () => {
    setShowbtns(showbtns === 'on' ? 'off' : 'on');
  };

  return (
    <div className="container mx-auto px-4">
      <Breadcrumbs size="lg" separator="/">
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem href="/settings">Settings</BreadcrumbItem>
        <BreadcrumbItem>Player</BreadcrumbItem>
      </Breadcrumbs>
      <h1 className="mt-10 text-3xl font-bold">Player Settings</h1>
      <p className="max-w-[60%] text-gray-400">
        You can basically find all the player settings here. You can customize
        colors based on your preference and everything. Not the layout, just the
        colors and your preferences.
      </p>
      <div className="mt-20 flex items-center gap-5">
        <div className="max-w-[60%]">
          <h2 className="text-2xl font-bold">Autoskip</h2>
          <p className="text-gray-400">
            Auto skip the intro or ending. If you don&apos;t turn it on then you
            will get to see &quot;Skip Intro&quot; or &quot;Skip Ending&quot;
            button. If you turn it on, they are gonna skip intro and outro
            automatically
          </p>
        </div>
        <Switch
          defaultSelected={autoskip === 'on'}
          onChange={handleAutoskipChange}
        />
      </div>
      <div className="mt-20 flex items-center gap-5">
        <div className="max-w-[60%]">
          <h2 className="text-2xl font-bold">Show Buttons</h2>
          <p className="text-gray-400">
            If you don&apos;t turn it on then you won&apos; get to see
            &quot;Skip Intro&quot; or &quot;Skip Ending&quot; button either. If
            you turn off both of them then you can basically remove intro and
            outro skipping
          </p>
        </div>
        <Switch
          defaultSelected={showbtns === 'on'}
          onChange={handleShowbtnsChange}
        />
      </div>
    </div>
  );
}
