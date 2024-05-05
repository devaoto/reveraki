'use client';

import { GenerateColoredElementByStatus } from '@/functions/jsxUtilityFunctions';
import useTruncate from '@/hooks/useTruncate';
import { ConsumetAnime } from '@/types/consumet';
import { Image, Link, Tooltip } from '@nextui-org/react';
import { motion } from 'framer-motion';

export const Card = ({ anime }: { anime: ConsumetAnime }) => {
  return (
    <div>
      <Link href={`/info/${anime.id}`}>
        <motion.div
          className="rounded-lg"
          whileHover={{
            boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)',
            outline: `4px solid ${anime.color ?? '#326d6c'}`,
          }}
          whileTap={{ scale: 0.97 }}
        >
          {anime.image && (
            <motion.div>
              <Image
                isZoomed
                src={anime.image}
                alt={anime.title.english ?? anime.title.romaji}
                width={300}
                height={500}
                className="max-h-[310px] min-h-[310px] rounded-lg object-cover"
              />
            </motion.div>
          )}
        </motion.div>
      </Link>
      <Tooltip
        color="success"
        content={anime.title.english ?? anime.title.romaji}
      >
        <h1
          className="mt-2 line-clamp-1 text-left text-lg font-medium"
          style={{ color: anime.color ?? '#326d6c' }}
        >
          {useTruncate(anime.title.english ?? anime.title.romaji, {
            length: 20,
          })}
        </h1>
      </Tooltip>
      <div className="flex gap-2 text-sm font-semibold">
        <Tooltip color="primary" content="Total Episodes" placement="right-end">
          {anime?.totalEpisodes ?? 0}
        </Tooltip>{' '}
        |{' '}
        <Tooltip placement="top" color="success" content="Status">
          <GenerateColoredElementByStatus
            status={anime?.status ?? 'NOT_YET_RELEASED'}
          />
        </Tooltip>{' '}
        |{' '}
        <Tooltip placement="top" color="danger" content="Type">
          {anime?.type === 'TV' ? 'ANIME' : anime.type}
        </Tooltip>
      </div>
    </div>
  );
};
