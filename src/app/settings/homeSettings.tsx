'use client';

import { useState, useEffect } from 'react';
import { BreadcrumbItem, Breadcrumbs, Switch } from '@nextui-org/react';

export default function Settings() {
  const [playHomeTrailer, setPlayHomeTrailer] = useState(
    () => localStorage.getItem('homeTrailer') || 'on',
  );
  useEffect(() => {
    localStorage.setItem('homeTrailer', playHomeTrailer);
  }, [playHomeTrailer]);

  const handleHomeTrailerChange = () => {
    setPlayHomeTrailer(playHomeTrailer === 'on' ? 'off' : 'on');
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
        You can basically find all the home page settings here.
      </p>
      <div className="mt-20 flex items-center gap-5">
        <div className="max-w-[60%]">
          <h2 className="text-2xl font-bold">Home Trailer</h2>
          <p className="text-gray-400">
            Control whether it should play the trailer it does on the home. If
            you turn it off, a slider will be shown instead of trailer.
          </p>
        </div>
        <Switch
          defaultSelected={playHomeTrailer === 'on'}
          onChange={handleHomeTrailerChange}
        />
      </div>
    </div>
  );
}
