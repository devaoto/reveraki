'use client';

import { motion } from 'framer-motion';
import { IEpisode } from '@/functions/utilityFunctions';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { BiGrid, BiLayout, BiAlignLeft } from 'react-icons/bi';
import { Button, Image, Tooltip } from '@nextui-org/react';

export const EpisodesList = ({
  episodes,
  id,
  current,
}: {
  episodes: IEpisode[];
  id: string;
  current?: number;
}) => {
  const [layoutOption, setLayoutOption] = useState<
    'grid' | 'flex-col' | 'layout-3'
  >('flex-col');

  useEffect(() => {
    const storedLayoutOption = localStorage.getItem('layoutOption');
    if (
      storedLayoutOption &&
      ['grid', 'flex-col', 'layout-3'].includes(storedLayoutOption)
    ) {
      setLayoutOption(storedLayoutOption as 'grid' | 'flex-col' | 'layout-3');
    }
  }, []);

  const handleLayoutChange = (layout: 'grid' | 'flex-col' | 'layout-3') => {
    setLayoutOption(layout);
  };
  return (
    <div className="gap-2 overflow-y-auto overflow-x-hidden">
      <div className="flex justify-end gap-2 mb-2">
        <Button
          color="primary"
          variant={layoutOption === 'grid' ? 'solid' : 'ghost'}
          onClick={() => handleLayoutChange('grid')}
        >
          <BiGrid />
        </Button>
        <Button
          color="primary"
          variant={layoutOption === 'flex-col' ? 'solid' : 'ghost'}
          onClick={() => handleLayoutChange('flex-col')}
        >
          <BiLayout />
        </Button>
        <Button
          color="primary"
          variant={layoutOption === 'layout-3' ? 'solid' : 'ghost'}
          onClick={() => handleLayoutChange('layout-3')}
        >
          <BiAlignLeft />
        </Button>
      </div>
      <div className="gap-2 overflow-y-auto overflow-x-hidden">
        {layoutOption === 'grid' && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4">
            {episodes.map((episode) => (
              <Tooltip key={episode.id} content={episode.title}>
                <Link href={`/watch/${id}/${episode.number}`}>
                  <motion.div
                    className="cursor-pointer bg-base-200"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="relative">
                      <Image
                        src={episode.img!}
                        alt={episode.title}
                        width={1500}
                        height={1500}
                        className="object-cover lg:min-h-[150px] min-h-[50px] min-w-[100px] sm:max-w-[200px] md:min-w-[150px] md:max-w-[150px] lg:min-w-[200px] lg:max-w-[200px] xl:min-w-[250px] xl:max-w-[250px]"
                      />
                      <div className="absolute bg-black opacity-65 text-white top-0 left-0 z-20">
                        EP {episode.number}
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </Tooltip>
            ))}
          </div>
        )}
        {layoutOption === 'flex-col' && (
          <div className="max-h-96 flex flex-col gap-4">
            {episodes.map((episode) => (
              <Link key={episode.id} href={`/watch/${id}/${episode.number}`}>
                <motion.div
                  className="cursor-pointer bg-base-200"
                  whileHover={{ scale: 1.02 }}
                >
                  <motion.div
                    className="flex gap-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    {episode.img && (
                      <div className="flex flex-col gap-4 sm:flex-row">
                        <div className="">
                          <Image
                            src={episode.img}
                            alt={episode.title}
                            width={1500}
                            height={1500}
                            className="object-cover min-h-[200px] sm:min-h-[50px] sm:min-w-[100px] sm:max-w-[200px] md:min-w-[150px] md:max-w-[150px] lg:min-w-[200px] lg:max-w-[200px] xl:min-w-[250px] xl:max-w-[250px]"
                          />
                        </div>
                        <div className="flex flex-col">
                          <h1>
                            {episode.title.startsWith('Episode')
                              ? ''
                              : `${episode.number} -`}{' '}
                            {episode.title}
                          </h1>
                          <p className="text-xs">{episode.description}</p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </motion.div>
              </Link>
            ))}
          </div>
        )}
        {layoutOption === 'layout-3' && (
          <div className="flex flex-wrap gap-2">
            {episodes.map((episode) => (
              <Tooltip key={episode.id} content={episode.title!}>
                <Link href={`/watch/${id}/${episode.number}`}>
                  <Button
                    color={'primary'}
                    variant={current === episode.number ? 'solid' : 'ghost'}
                  >
                    {episode.number}
                  </Button>
                </Link>
              </Tooltip>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
