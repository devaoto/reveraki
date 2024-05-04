import { EpisodesList } from '@/components/EpisodesList';
import Player from '@/components/Player/VidstackPlayer';
import { getInfo, getEpisodes, getSources } from '@/functions/requests';
import { IEpisode } from '@/functions/utilityFunctions';
import { AnimeInfo, SiteEpisode } from '@/types/site';
import { use } from 'react';
import { Accordions } from './Accordions';
import { Metadata, Viewport } from 'next';
import { Image } from '@nextui-org/react';
import {
  GenerateColoredElementBySeason,
  GenerateColoredElementByStatus,
} from '@/functions/jsxUtilityFunctions';

export async function generateMetadata({
  params,
}: Readonly<{ params: { id: string; episode: number } }>): Promise<Metadata> {
  const info = (await getInfo(params.id)) as AnimeInfo;
  const episodes = (await getEpisodes(params.id)) as SiteEpisode[];
  const episode = episodes.find((e) => e.number === Number(params.episode));

  return {
    title:
      episode && !episode?.title.startsWith('Episode')
        ? episode.title
        : `Watch episode ${params.episode} of ${
            info.title.english ?? info.title.romaji
          }`,
    description:
      episode && !/^\d+(st|nd|rd|th)/.test(episode.description)
        ? episode.description
        : `${info.description.replace(/<\/?[^>]+(>|$)/g, '').slice(0, 180)}...`,
    openGraph: {
      images: info ? info.coverImage : 'No image',
    },
  };
}

export async function generateViewport({
  params,
}: Readonly<{ params: { id: string; episode: number } }>): Promise<Viewport> {
  const info = (await getInfo(params.id)) as AnimeInfo;
  return {
    themeColor: info.color ? info.color : '#000000',
  };
}

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

  const sources = use(getSources(params.id, foundEp?.id!)).sources;

  return (
    <>
      <div className="flex flex-col lg:flex-row justify-between ml-5 mr-5">
        <div className="md:mr-5 flex-grow lg:min-w-[72rem] max-w-6xl">
          <div className="flex flex-col gap-2">
            <Player
              hls={
                sources.find(
                  (s: any) => s.quality === 'auto' || s.quality === 'default'
                ).url
              }
              title={foundEp?.title!}
              cover={foundEp?.img!}
              idMal={info?.malId!}
              currentEp={params.episode}
            />
            <h1 className="text-xl font-bold">{foundEp?.title}</h1>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <Image
            src={info?.bannerImage}
            alt={info?.title.english ?? info?.title.romaji}
            width={300}
            height={500}
          />
          <h1 className="text-xl text-center font-bold">
            {info?.title.english ?? info?.title.romaji}
          </h1>
          <p className="max-w-[60%] line-clamp-4 text-center">
            {info?.description}
          </p>
          <p className="font-semibold">
            {info?.type} |{' '}
            {<GenerateColoredElementByStatus status={info?.status!} />} |{' '}
            {<GenerateColoredElementBySeason season={info?.season!} />}
          </p>
        </div>
      </div>

      <div className="ml-5 mt-10">
        <Accordions info={info!} episodes={episode!} id={params.id} />
      </div>
    </>
  );
}
