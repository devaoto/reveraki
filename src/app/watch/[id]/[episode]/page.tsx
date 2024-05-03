import { EpisodesList } from '@/components/EpisodesList';
import Player from '@/components/Player/VidstackPlayer';
import { GenerateColoredElementBySeason } from '@/functions/jsxUtilityFunctions';
import { getInfo, getEpisodes, getSources } from '@/functions/requests';
import {
  IEpisode,
  capitalizeFirstLetter,
  numberToMonth,
} from '@/functions/utilityFunctions';
import { Cards } from '@/components/Card';
import { AnimeInfo, SiteEpisode } from '@/types/site';
import { Accordion, AccordionItem } from '@nextui-org/react';
import { use } from 'react';
import { ConsumetAnime } from '@/types/consumet';
import { Accordions } from './Accordions';

export default function Watch({
  params,
}: {
  params: { id: string; episode: number };
}) {
  const infoOrMessagePromise = getInfo(params.id) as Promise<AnimeInfo>;
  const episodeOrMessagePromise = getEpisodes(params.id) as Promise<
    SiteEpisode[]
  >;

  const [infoOrMessage, episodeOrMessage] = use(
    Promise.all([infoOrMessagePromise, episodeOrMessagePromise])
  );

  const info =
    'message' in infoOrMessage ? undefined : (infoOrMessage as AnimeInfo);
  const episode =
    'message' in episodeOrMessage
      ? undefined
      : (episodeOrMessage as IEpisode[]);

  const foundEp = episode?.find((e) => e.number === Number(params.episode));

  const source = use(getSources(params.id, foundEp?.id!)).sources.find(
    (s: any) => s.quality === 'default'
  ).url;

  return (
    <>
      <div className="flex flex-col md:flex-row justify-center">
        <div className="md:mr-5 flex-grow max-w-6xl">
          <div className="flex flex-col gap-2">
            <Player
              hls={source}
              title={foundEp?.title!}
              cover={foundEp?.img!}
            />
            <h1 className="text-xl font-bold">{foundEp?.title}</h1>
          </div>
        </div>
        <div className="md:mt-10">
          <h1 className="text-3xl font-bold mb-4">Episodes</h1>
          <EpisodesList episodes={episode!} id={params.id} />
        </div>
      </div>
      <div>
        <Accordions info={info!} />
      </div>
    </>
  );
}
