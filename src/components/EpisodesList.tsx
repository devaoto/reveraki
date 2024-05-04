'use client';

import { motion } from 'framer-motion';
import { IEpisode } from '@/functions/utilityFunctions';
import Image from 'next/image';
import Link from 'next/link';

export const EpisodesList = ({
  episodes,
  id,
  current,
}: {
  episodes: IEpisode[];
  id: string;
  current?: number;
}) => {
  return (
    <div className="gap-2 overflow-y-auto overflow-x-hidden">
      <div className="max-h-96 flex flex-col gap-4">
        {!current ? (
          <>
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
                            className="object-cover min-h-[200px] sm:min-w-[100px] sm:max-w-[200px] md:min-w-[150px] md:max-w-[250px] lg:min-w-[200px] lg:max-w-[300px] xl:min-w-[250px] xl:max-w-[350px]"
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
          </>
        ) : (
          <>
            {episodes.map((episode) => (
              <Link
                key={episode.id}
                href={
                  current === episode.number
                    ? '#'
                    : `/watch/${id}/${episode.number}`
                }
              >
                <motion.div
                  className={`${
                    current === episode.number
                      ? 'cursor-no-drop'
                      : 'cursor-pointer'
                  } ${current === episode.number ? 'bg-[#291a25]' : ''}`}
                  whileHover={{ scale: current === episode.number ? 1 : 1.02 }}
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
                            className="object-cover min-h-[200px] sm:min-w-[100px] sm:max-w-[200px] md:min-w-[150px] md:max-w-[250px] lg:min-w-[200px] lg:max-w-[300px] xl:min-w-[250px] xl:max-w-[350px]"
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
          </>
        )}
      </div>
    </div>
  );
};
