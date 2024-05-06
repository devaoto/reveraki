'use client';

import { useState, useEffect } from 'react';
import {
  Autocomplete,
  AutocompleteItem,
  BreadcrumbItem,
  Breadcrumbs,
  Input,
  Switch,
} from '@nextui-org/react';

export default function Settings() {
  const [autoskip, setAutoskip] = useState(
    () => localStorage.getItem('autoSkip') || 'off',
  );
  const [showbtns, setShowbtns] = useState(
    () => localStorage.getItem('showbtns') || 'off',
  );
  const [playerMenuColor, setPlayerMenuColor] = useState(
    () => localStorage.getItem('playerMenuColor') || 'bg-primary',
  );
  const [playerBaseColor, setPlayerBaseColor] = useState(
    () => localStorage.getItem('playerBaseColor') || '#05234e',
  );

  const colors = [
    {
      key: 'primary',
      value: 'bg-primary',
      label: 'Primary',
      className: 'text-primary',
    },
    {
      key: 'secondary',
      value: 'bg-secondary',
      label: 'Secondary',
      className: 'text-secondary',
    },
    {
      key: 'success',
      value: 'bg-success',
      label: 'Success',
      className: 'text-success',
    },
    {
      key: 'warning',
      value: 'bg-warning',
      label: 'Warning',
      className: 'text-warning',
    },
    {
      key: 'danger',
      value: 'bg-danger',
      label: 'Danger',
      className: 'text-danger',
    },
  ] as const;

  useEffect(() => {
    localStorage.setItem('autoSkip', autoskip);
  }, [autoskip]);

  useEffect(() => {
    localStorage.setItem('showbtns', showbtns);
  }, [showbtns]);

  useEffect(() => {
    localStorage.setItem('playerMenuColor', playerMenuColor);
  }, [playerMenuColor]);

  useEffect(() => {
    localStorage.setItem('playerBaseColor', playerBaseColor);
  }, [playerBaseColor]);

  const handleAutoskipChange = () => {
    setAutoskip(autoskip === 'on' ? 'off' : 'on');
  };

  const handleShowbtnsChange = () => {
    setShowbtns(showbtns === 'on' ? 'off' : 'on');
  };

  const handlePlayerMenuColorChange = (value: string) => {
    setPlayerMenuColor(value);
  };

  const handlePlayerBaseColorChange = (e: any) => {
    const newColor = e.target.value;
    setPlayerBaseColor(newColor);
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
      <div className="mt-20 flex items-center gap-5">
        <div className="max-w-[60%]">
          <h2 className="text-2xl font-bold">Player Base Color</h2>
          <p className="text-gray-400">
            The color is shown on the timeline and volume etc etc. Default:
            blue. You must provide hex, and if you break the site by providing
            color names we are no one to blame.
          </p>
        </div>
        <Input
          label="Hex color"
          type={'text'}
          onChange={handlePlayerBaseColorChange}
        />
      </div>
      <div className="mt-20 flex items-center gap-5">
        <div className="max-w-[60%]">
          <h2 className="text-2xl font-bold">Player Menu Color</h2>
          <p className="text-gray-400">
            The background color you can see in the player menu when you click
            the settings. The default is primary but you can select between:
            primary, secondary, success, warning, danger
          </p>
        </div>
        <Autocomplete
          label="Menu Color"
          onSelectionChange={(key) => {
            const selectedColor = colors.find((color) => color.key === key);
            if (selectedColor) {
              handlePlayerMenuColorChange(selectedColor.value);
            }
          }}
          value={playerMenuColor}
        >
          <AutocompleteItem
            key="primary"
            value="bg-primary"
            className="text-primary"
          >
            Primary
          </AutocompleteItem>
          <AutocompleteItem
            key="secondary"
            value="bg-secondary"
            className="text-secondary"
          >
            Secondary
          </AutocompleteItem>
          <AutocompleteItem
            key="success"
            value="bg-success"
            className="text-success"
          >
            Success
          </AutocompleteItem>
          <AutocompleteItem
            key="warning"
            value="bg-warning"
            className="text-warning"
          >
            Warning
          </AutocompleteItem>
          <AutocompleteItem
            key="danger"
            value="bg-danger"
            className="text-danger"
          >
            Danger
          </AutocompleteItem>
        </Autocomplete>
      </div>
    </div>
  );
}
