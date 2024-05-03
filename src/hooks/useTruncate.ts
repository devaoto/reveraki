'use client';

import { useState, useEffect } from 'react';

interface Options {
  length: number;
  omission?: string;
}

export const useTruncate = (text: string, options: Options): string => {
  const { length, omission = '...' } = options;
  const [truncatedText, setTruncatedText] = useState(text);

  useEffect(() => {
    if (text.length > length) {
      setTruncatedText(text.slice(0, length - omission.length) + omission);
    } else {
      setTruncatedText(text);
    }
  }, [text, length, omission]);

  return truncatedText;
};

export default useTruncate;
