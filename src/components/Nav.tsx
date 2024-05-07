'use client';

import React, { useEffect, useState } from 'react';
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Input,
} from '@nextui-org/react';
import { Yeseva_One } from 'next/font/google';
import { BiSearch } from 'react-icons/bi';
import { getRandom } from '@/functions/utilityFunctions';
import { ConsumetSearchResult } from '@/types/consumet';
import useDebounce from '@/hooks/useDebounce';
import { Image } from '@nextui-org/react';
import { CiSettings } from 'react-icons/ci';

const yesevaOne = Yeseva_One({
  subsets: ['latin', 'cyrillic', 'cyrillic-ext', 'latin-ext'],
  weight: ['400'],
});

export default function NavComp() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [searchResults, setSearchResults] =
    useState<ConsumetSearchResult | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [label, setLabel] = useState<string>('Spy x Family');

  const debouncedSearch = useDebounce(searchQuery, 1000);

  useEffect(() => {
    setLabel(
      getRandom(
        'Darling In The Franxx',
        'Naruto Shippudden',
        'The 100 Girlfrineds',
        'Friren: Beyond...',
        'Delicious in',
      )!,
    );
  }, []);

  useEffect(() => {
    async function search(
      query: string,
    ): Promise<ConsumetSearchResult | undefined> {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_DOMAIN!}/api/v1/search/${query}`,
          { headers: { 'x-site': 'ezanime' } },
        );
        return (await response.json()) as ConsumetSearchResult;
      } catch (error) {
        console.log(error);
      }
    }

    const fetchSearchResults = async (query: string) => {
      if (query.trim() !== '') {
        const result = await search(query);
        setSearchResults(result as ConsumetSearchResult);
      } else {
        setSearchResults(null);
      }
    };

    fetchSearchResults(debouncedSearch);
  }, [debouncedSearch]);

  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSearchQuery(event.target.value);
  };

  const handleOpen = () => {
    onOpen();
  };

  return (
    <>
      <Navbar shouldHideOnScroll>
        <NavbarBrand>
          <Link color="foreground" href="/">
            <h1 className={`text-4xl ${yesevaOne.className}`}>
              Rever<span className="text-primary">Aki</span>
            </h1>
          </Link>
        </NavbarBrand>
        <NavbarContent className="hidden gap-4 sm:flex" justify="center">
          <NavbarItem>
            <Link color="foreground" href="/">
              Home
            </Link>
          </NavbarItem>
          <NavbarItem isActive>
            <Link href="/trending" aria-current="page">
              Trending
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link color="foreground" href="/popular">
              Popular
            </Link>
          </NavbarItem>
        </NavbarContent>
        <NavbarContent justify="end">
          <Button isIconOnly variant="light" onPress={() => handleOpen()}>
            <BiSearch />
          </Button>
          <Button isIconOnly variant="light">
            <a href="/settings">
              <CiSettings />
            </a>
          </Button>
        </NavbarContent>
      </Navbar>
      <div>
        <Modal size="md" isOpen={isOpen} onClose={onClose}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Search Anything
                </ModalHeader>
                <ModalBody>
                  <Input onChange={handleSearchInputChange} label={label} />
                  <div className="mt-10">
                    {searchResults && !('message' in searchResults) && (
                      <div className="max-h-[250px] overflow-y-scroll">
                        {searchResults.results
                          .filter(
                            (s) =>
                              s.status !== 'Not yet aired' &&
                              s.status !== 'NOT_YET_RELEASED',
                          )
                          .map((result) => (
                            <Link key={result.id} href={`/info/${result.id}`}>
                              <div className="hover:bg-base-200 mb-2 flex cursor-pointer items-center gap-2 duration-200">
                                <Image
                                  src={result.image}
                                  alt={result.title.romaji}
                                  isZoomed
                                  width={1000}
                                  height={1000}
                                  className="max-h-[200px] max-w-[100px] object-cover"
                                />
                                <div>
                                  <p
                                    style={{ color: result.color ?? 'crimson' }}
                                  >
                                    {result.title.english
                                      ? result.title.english
                                      : result.title.romaji}
                                  </p>
                                  <p>Rating: {result.rating / 10 ?? 0.0}</p>
                                  <p>
                                    Total Episodes:{' '}
                                    {result.currentEpisode ??
                                      result.totalEpisodes}
                                  </p>
                                </div>
                              </div>
                            </Link>
                          ))}
                      </div>
                    )}
                  </div>
                </ModalBody>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </>
  );
}

