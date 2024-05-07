'use client';

import { Breadcrumbs, BreadcrumbItem, Link } from '@nextui-org/react';

export default function DMCA() {
  return (
    <div className="mx-auto px-4 py-8">
      <Breadcrumbs isDisabled size="lg">
        <BreadcrumbItem>Home</BreadcrumbItem>
        <BreadcrumbItem>DMCA</BreadcrumbItem>
      </Breadcrumbs>

      <h1 className="mb-2 mt-4 text-4xl font-bold">DMCA Note</h1>
      <p className="text-2xl text-primary-200">
        ReverAki operates independently and is not formally associated with nor
        endorsed by any of the anime studios responsible for the creation of the
        anime featured on this platform. Our website serves solely as a user
        interface, facilitating access to self-hosted files sourced from various
        third-party providers across the internet. It&apos;s important to note
        that ReverAki never initiates downloads of video content from these
        providers. Instead, links are provided in response to user requests,
        thereby absolving the platform from any potential DMCA compliance
        issues.
      </p>
    </div>
  );
}
