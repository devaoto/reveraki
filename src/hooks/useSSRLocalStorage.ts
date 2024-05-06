/* eslint-disable react-hooks/rules-of-hooks */
import useLocalStorage from 'react-use-localstorage';
import React from 'react';

export const useSSRLocalStorage = (
  key: string,
  initial: string,
): [string, React.Dispatch<string>] => {
  return typeof window === 'undefined'
    ? [initial, (value: string) => undefined]
    : useLocalStorage(key, initial);
};
