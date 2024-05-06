import React from 'react';
import { FaGithub, FaDiscord } from 'react-icons/fa';
import { Link, Tooltip } from '@nextui-org/react';
import { Yeseva_One } from 'next/font/google';

const yesevaOne = Yeseva_One({
  subsets: ['latin', 'cyrillic', 'cyrillic-ext', 'latin-ext'],
  weight: ['400'],
});

function Footer() {
  const year = new Date().getFullYear();

  return (
    <div className="flex-grow">
      <footer className="mt-10 bg-[#151518]">
        <div className="mx-auto w-full p-4 py-6 lg:max-w-[85%] lg:pb-3 lg:pt-8">
          <div className="lg:flex lg:justify-between">
            <div className="mb-6 lg:mb-0">
              <div className="flex w-fit items-center">
                <Link color="foreground" href="/">
                  <h1 className={`text-4xl ${yesevaOne.className}`}>
                    Rever<span className="text-[#f45c92]">Aki</span>
                  </h1>
                </Link>
              </div>
              <p className="font-karla text-[0.7rem] text-[#ffffffb2] lg:w-[520px] lg:text-[0.8rem]">
                This site does not store any files on our server, we are linked
                to the media which is hosted on 3rd party services.
              </p>
            </div>
            <ul className="flex flex-col gap-2 text-[0.7rem] font-semibold text-[#ffffffb2] lg:text-[0.85rem]">
              <li>
                <Link href="/dmca"> DMCA</Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  target="_blank"
                  className="!text-[0.8rem] !font-semibold"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/settings"
                  target="_blank"
                  className="!text-[0.8rem] !font-semibold"
                >
                  Settings
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </footer>
      <div className="mt-2 border-t border-white/5 bg-gray-600"></div>
      <div className="mx-auto w-full py-3 text-[0.7rem] text-[#ffffffb2] lg:flex lg:max-w-[83%] lg:items-center lg:justify-between lg:text-[0.8rem]">
        <span className="ms-5 sm:text-center lg:ms-0">
          <span className="select-none">©</span> {year}{' '}
          <Link color="foreground" href="/">
            <h1 className={`${yesevaOne.className}`}>
              Rever<span className="text-[#f45c92]">Aki</span>
            </h1>
          </Link>{' '}
          | Made by <span className="font-bold">codeblitz97</span>
        </span>
        <div className="mt-4 flex lg:mt-0 lg:justify-center">
          <Link
            href="https://github.com/codeblitz97/reveraki"
            target="_blank"
            className=" ms-5 hover:text-gray-900 dark:hover:text-white lg:ms-0"
          >
            <Tooltip content="GitHub">
              <FaGithub className="h-5 w-5" />
            </Tooltip>
            <span className="sr-only">GitHub account</span>
          </Link>
          <Link
            href="https://discord.gg/AKMfgTnd"
            target="_blank"
            className=" ms-5 hover:text-gray-900 dark:hover:text-white"
          >
            <Tooltip content="Discord Community">
              <FaDiscord className="h-[22px] w-[22px]" />
            </Tooltip>
            <span className="sr-only">Discord community</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Footer;
