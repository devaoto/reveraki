'use client';
import { Breadcrumbs, BreadcrumbItem } from '@nextui-org/react';

import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs isDisabled size="lg">
        <BreadcrumbItem>Home</BreadcrumbItem>
        <BreadcrumbItem>Privacy Policy</BreadcrumbItem>
      </Breadcrumbs>

      <h1 className="mb-4 text-3xl font-semibold">Privacy Policy</h1>
      <h1 className="text-2xl">Last updated: 05/06/2024</h1>
      <p className="mb-4 text-lg">
        At Reveraki, we take your privacy seriously. We are committed to
        protecting the privacy of our users and ensuring that all personal
        information provided to us remains confidential.
      </p>
      <p className="mb-4 text-lg">
        Reveraki does not collect any personal information from its users. We do
        not use cookies or any other tracking technologies. We only store a few
        settings locally when the app is accessed from localhost. You can remove
        your local storage data by clearing your browser site cache or removing
        local storage values.
      </p>
      <p className="mb-4 text-lg">
        Our app is designed to respect your privacy and anonymity. You can use
        Reveraki with the assurance that your personal information will never be
        compromised.
      </p>
      <p className="mb-4 text-lg">
        If you have any questions or concerns about our privacy policy, please
        feel free to contact us at privacy@reveraki.com.
      </p>
    </div>
  );
};

export default PrivacyPolicy;
