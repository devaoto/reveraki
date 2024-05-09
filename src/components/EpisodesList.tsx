'use client';

import { motion } from 'framer-motion';
import { IEpisode } from '@/functions/utilityFunctions';
import Link from 'next/link';
import { BiGrid, BiLayout, BiAlignLeft } from 'react-icons/bi';
import { Button, Image, Tooltip } from '@nextui-org/react';
import { useSSRLocalStorage } from '@/hooks/useSSRLocalStorage';

const EpisodesList = ({
  episodes,
  id,
  current,
}: {
  episodes: IEpisode[];
  id: string;
  current?: number;
}) => {
  const [layoutOption, setLayoutOption] = useSSRLocalStorage(
    'layoutOption',
    'flex-col',
  );

  const handleLayoutChange = (layout: 'grid' | 'flex-col' | 'layout-3') => {
    setLayoutOption(layout);
  };

  return (
    <div className="gap-2 overflow-y-auto overflow-x-hidden">
      <div className="mb-2 flex justify-end gap-2">
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
      <div className="gap-2 overflow-x-hidden overflow-y-scroll">
        {layoutOption === 'grid' && (
          <div className="grid grid-cols-3 gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {episodes.map((episode) => (
              <Tooltip key={episode.id} content={episode.title}>
                <Link href={`/watch/${id}/${episode.number}`}>
                  <motion.div
                    className="bg-base-200 cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="relative">
                      <Image
                        src={episode.img!}
                        alt={episode.title}
                        width={1600}
                        height={900}
                        className="min-h-[200px] object-cover sm:min-h-[50px] sm:min-w-[100px] sm:max-w-[200px] md:min-h-[50px] md:min-w-[150px] md:max-w-[150px] lg:min-h-[100px] lg:min-w-[200px] lg:max-w-[200px] xl:min-h-[150px] xl:min-w-[250px] xl:max-w-[250px]"
                      />
                      <div className="absolute left-0 top-0 z-20 bg-black text-white opacity-65">
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
          <div className="flex max-h-96 flex-col gap-4">
            {episodes.map((episode) => (
              <Link key={episode.id} href={`/watch/${id}/${episode.number}`}>
                <motion.div
                  className="bg-base-200 cursor-pointer"
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
                            width={1600}
                            height={900}
                            className="min-h-[200px] object-cover sm:min-h-[50px] sm:min-w-[100px] sm:max-w-[200px] md:min-h-[50px] md:min-w-[150px] md:max-w-[150px] lg:min-h-[100px] lg:min-w-[200px] lg:max-w-[200px] xl:min-h-[150px] xl:min-w-[250px] xl:max-w-[250px]"
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

export default EpisodesList;

