'use client';

import React from 'react';
import { Cards } from '@/components/Card';
import { GenerateColoredElementBySeason } from '@/functions/jsxUtilityFunctions';
import {
  numberToMonth,
  capitalizeFirstLetter,
  IEpisode,
} from '@/functions/utilityFunctions';
import { ConsumetAnime } from '@/types/consumet';
import { AnimeInfo } from '@/types/site';
import { Accordion, AccordionItem } from '@nextui-org/react';
import dynamic from 'next/dynamic';

const EpisodesList = dynamic(() => import('@/components/EpisodesList'), {
  ssr: false,
});

export const Accordions = ({
  info,
  episodes,
  id,
}: {
  info: AnimeInfo;
  episodes: IEpisode[];
  id: string;
}) => {
  const [selectedKeys, setSelectedKeys] = React.useState(new Set(['1', '2']));

  return (
    // @ts-ignore
    <Accordion selectedKeys={selectedKeys} onSelectionChange={setSelectedKeys}>
      <AccordionItem key="1" aria-label="Episodes" title="Episodes">
        <div>
          <div>
            <EpisodesList episodes={episodes} id={id} />
          </div>
        </div>
      </AccordionItem>
      <AccordionItem
        key="2"
        aria-label="Recommendations"
        title="Recommendations"
      >
        <div>
          <div>
            <Cards
              data={{
                currentPage: 1,
                hasNextPage: false,
                results: info?.recommendations.map((r) => ({
                  ...r,
                  totalEpisodes: r.episodes,
                  episodes: undefined,
                })) as unknown as ConsumetAnime[],
              }}
            />
          </div>
        </div>
      </AccordionItem>
    </Accordion>
  );
};

