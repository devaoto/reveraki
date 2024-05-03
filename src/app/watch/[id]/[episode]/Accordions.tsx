'use client';

import { Cards } from '@/components/Card';
import { GenerateColoredElementBySeason } from '@/functions/jsxUtilityFunctions';
import {
  numberToMonth,
  capitalizeFirstLetter,
} from '@/functions/utilityFunctions';
import { ConsumetAnime } from '@/types/consumet';
import { AnimeInfo } from '@/types/site';
import { Accordion, AccordionItem } from '@nextui-org/react';

export const Accordions = ({ info }: { info: AnimeInfo }) => {
  return (
    <Accordion>
      <AccordionItem key="1" aria-label="Overview" title="Overview">
        <div>
          <h1 className="text-xl">
            Overview of{' '}
            <strong className="font-bold">
              {info?.title.english ?? info?.title.romaji}
            </strong>
          </h1>
          <div dangerouslySetInnerHTML={{ __html: info?.description! }} />
          <div className="mt-10">
            <p>
              <strong className="font-bold">Studios: </strong>
              {info?.studios.join(', ')}
            </p>
            <p>
              <strong className="font-bold">Country: </strong>
              {info?.countryOfOrigin}
            </p>
            <p>
              <strong className="font-bold">Rating: </strong>
              {info?.averageRating! / 10}
            </p>
            <p>
              <strong className="font-bold">Total Episodes: </strong>
              {info?.totalEpisodes}
            </p>
            <p>
              <strong className="font-bold">Release Date: </strong>
              {info?.startDate.day} {numberToMonth(info?.startDate.month!)}{' '}
              {info?.startDate.year}
            </p>
            <p>
              <strong className="font-bold">Season: </strong>
              {
                <GenerateColoredElementBySeason
                  season={capitalizeFirstLetter(info?.season!)}
                />
              }{' '}
              {info?.year}
            </p>
            <p>
              <strong className="font-bold">Duration Per Episode: </strong>
              {info?.duration}
            </p>
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
