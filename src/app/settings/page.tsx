'use client';

import { Breadcrumbs, BreadcrumbItem, Link } from '@nextui-org/react';
import { MdSettings, MdHome } from 'react-icons/md';

export default function Settings() {
  return (
    <div className="container mx-auto px-4">
      <Breadcrumbs separator="/">
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem>Settings</BreadcrumbItem>
      </Breadcrumbs>
      <h1 className="mt-10 text-3xl font-bold">Choose a Setting</h1>
      <div className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="rounded-lg bg-[#12010e] p-6 shadow-md">
          <Link href="/settings/player" color="primary" className="block">
            <div className="mb-2 flex items-center">
              <MdSettings className="mr-2 text-xl" />
              <h2 className="text-xl font-semibold">Player Settings</h2>
            </div>
            <p className="text-gray-400">
              Configure settings related to the player.
            </p>
          </Link>
        </div>
        <div className="rounded-lg bg-[#12010e] p-6 shadow-md">
          <Link href="/settings/home" color="secondary" className="block">
            <div className="mb-2 flex items-center">
              <MdHome className="mr-2 text-xl" />
              <h2 className="text-xl font-semibold">Home Settings</h2>
            </div>
            <p className="text-gray-400">
              Customize settings for the home page.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
