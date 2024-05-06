'use client';

import { Button, Tooltip } from '@nextui-org/react';
import { useEffect, useState } from 'react';
import { BiArrowFromBottom } from 'react-icons/bi';

export const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  return (
    <div className="fixed bottom-2 right-2 z-[9999]">
      <Tooltip color="primary" placement="top" content="Scroll To Top">
        <Button
          isIconOnly
          variant="shadow"
          type="button"
          color="primary"
          onClick={scrollToTop}
          className={`
          ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        >
          <BiArrowFromBottom className="h-6 w-6" aria-hidden="true" />
        </Button>
      </Tooltip>
    </div>
  );
};
