'use client';

import { motion } from 'framer-motion';
import { IEpisode } from '@/functions/utilityFunctions';
import Image from 'next/image';
import Link from 'next/link';

export const EpisodesList = ({
  episodes,
  id,
}: {
  episodes: IEpisode[];
  id: string;
}) => {
  return (
    <div className="gap-2 overflow-y-auto overflow-x-hidden">
      <div className="max-h-96">
        {episodes.map((e) => {
          return (
            <Link key={e.id} href={`/watch/${id}/${e.number}`}>
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
                  {e.img ? (
                    <div className="flex flex-col gap-4 sm:flex-row">
                      <div className="">
                        <Image
                          src={e.img!}
                          alt={e.title}
                          width={200}
                          height={150}
                          className="object-cover min-h-[150px] sm:min-w-[100px] sm:max-w-[200px] md:min-w-[150px] md:max-w-[250px] lg:min-w-[200px] lg:max-w-[300px] xl:min-w-[250px] xl:max-w-[350px]"
                        />
                      </div>
                      <div className="flex flex-col">
                        <h1>
                          {e.number} - {e.title}
                        </h1>
                        <p className="text-xs">{e.description}</p>
                      </div>
                    </div>
                  ) : null}
                </motion.div>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
