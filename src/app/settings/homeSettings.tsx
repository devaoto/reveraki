'use client';

import { useState, useEffect } from 'react';
import {
  Autocomplete,
  AutocompleteItem,
  BreadcrumbItem,
  Breadcrumbs,
  Switch,
  colors,
} from '@nextui-org/react';

export default function Settings() {
  const [playHomeTrailer, setPlayHomeTrailer] = useState(
    () => localStorage.getItem('homeTrailer') || 'on',
  );

  const [themeColor, setThemeColor] = useState(
    () => localStorage.getItem('themeColor') || 'dark',
  );

  useEffect(() => {
    localStorage.setItem('homeTrailer', playHomeTrailer);
  }, [playHomeTrailer]);

  const handleHomeTrailerChange = () => {
    setPlayHomeTrailer(playHomeTrailer === 'on' ? 'off' : 'on');
  };

  useEffect(() => {
    localStorage.setItem('themeColor', themeColor);
  }, [themeColor]);

  const colors = [
    {
      key: 'primary',
      value: 'dark',
      label: 'Primary',
      className: 'text-primary',
    },
    {
      key: 'secondary',
      value: 'secondaryDark',
      label: 'Secondary',
      className: 'text-secondary',
    },
    {
      key: 'success',
      value: 'success',
      label: 'Success',
      className: 'text-success',
    },
    {
      key: 'warning',
      value: 'warning',
      label: 'Warning',
      className: 'text-warning',
    },
    {
      key: 'danger',
      value: 'danger',
      label: 'Danger',
      className: 'text-danger',
    },
    {
      key: 'navyBlue',
      value: 'navyBlue',
      label: 'Navy Blue',
      className: 'text-danger',
    },
  ] as const;

  const handleThemeColorChange = (value: string) => {
    setThemeColor(value);
    window.location.reload();
  };

  return (
    <div className="container mx-auto px-4">
      <Breadcrumbs size="lg" separator="/">
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem href="/settings">Settings</BreadcrumbItem>
        <BreadcrumbItem>Home</BreadcrumbItem>
      </Breadcrumbs>
      <h1 className="mt-10 text-3xl font-bold">Home Settings</h1>
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
      <div className="mt-20 flex items-center gap-5">
        <div className="max-w-[60%]">
          <h2 className="text-2xl font-bold">Theme Color</h2>
          <p className="text-gray-400">The main color of the site</p>
        </div>
        <Autocomplete
          label="Theme Color"
          onSelectionChange={(key) => {
            const selectedColor = colors.find((color) => color.key === key);
            if (selectedColor) {
              handleThemeColorChange(selectedColor.value);
            }
          }}
          value={themeColor}
        >
          <AutocompleteItem
            key="primary"
            value="dark"
            className="text-[#f45c92]"
          >
            Primary
          </AutocompleteItem>
          <AutocompleteItem
            key="secondary"
            value="secondaryDark"
            className="text-[#9252d1]"
          >
            Secondary
          </AutocompleteItem>
          <AutocompleteItem
            key="success"
            value="success"
            className="text-[#17c964]"
          >
            Success
          </AutocompleteItem>
          <AutocompleteItem
            key="warning"
            value="warning"
            className="text-[#f5a524]"
          >
            Warning
          </AutocompleteItem>
          <AutocompleteItem
            key="danger"
            value="danger"
            className="text-[#f31260]"
          >
            Danger
          </AutocompleteItem>
          <AutocompleteItem
            key="navyBlue"
            value="navyBlue"
            className="text-[#0a3066]"
          >
            Navy Blue
          </AutocompleteItem>
        </Autocomplete>
      </div>
    </div>
  );
}
