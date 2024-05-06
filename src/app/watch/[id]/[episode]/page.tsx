import Player from '@/components/Player/VidstackPlayer';
import {
  getInfo,
  getEpisodes,
  getSources,
  getThumbnails,
} from '@/functions/requests';
import { IEpisode, numberToMonth } from '@/functions/utilityFunctions';
import { AnimeInfo, SiteEpisode } from '@/types/site';
import { use } from 'react';
import { Accordions } from './Accordions';
import { Metadata, Viewport } from 'next';
import { Button, Image, Link } from '@nextui-org/react';
import {
  GenerateColoredElementBySeason,
  GenerateColoredElementByStatus,
} from '@/functions/jsxUtilityFunctions';
import { FaCalendarAlt } from 'react-icons/fa';
import { BiShareAlt } from 'react-icons/bi';
import { Share } from './Share';

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
    Promise.all([infoOrMessagePromise, episodeOrMessagePromise]),
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
      <div className="ml-5 mr-5 flex flex-col justify-between lg:flex-row">
        <div className="min-w-full max-w-6xl flex-grow md:mr-5 lg:min-w-[72rem]">
          <div className="flex flex-col gap-2">
            <Player
              epid={foundEp?.id!}
              animeTitle={
                (info?.title.english ??
                  info?.title.romaji ??
                  info?.title.english) as string
              }
              anId={params.id}
              hls={
                sources.find(
                  (s: any) => s.quality === 'auto' || s.quality === 'default',
                ).url
              }
              title={foundEp?.title!}
              cover={foundEp?.img!}
              idMal={info?.malId!}
              currentEp={params.episode}
            />
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold">{foundEp?.title}</h1>
              <Share
                id={params.id}
                episode={params.episode}
                title={foundEp?.title!}
              />
            </div>
          </div>
        </div>
        <Link href={`/info/${params.id}`}>
          <div className="flex flex-col items-center">
            <Image
              src={info?.bannerImage}
              alt={info?.title.english ?? info?.title.romaji}
              width={300}
              height={500}
            />
            <h1 className="line-clamp-1 text-center text-lg font-bold text-white">
              {info?.title.english ?? info?.title.romaji}
            </h1>
            <div>
              <div className="flex items-center gap-1 text-white">
                <FaCalendarAlt />{' '}
                <span>
                  {info?.startDate.day} {numberToMonth(info?.startDate.month!)}{' '}
                  {info?.startDate.year}
                </span>
              </div>
            </div>
            <div className="text-sm font-semibold">
              {info?.type} |{' '}
              {<GenerateColoredElementByStatus status={info?.status!} />} |{' '}
              {<GenerateColoredElementBySeason season={info?.season!} />}
            </div>
          </div>
        </Link>
      </div>

      <div className="ml-5 mt-10">
        <Accordions info={info!} episodes={episode!} id={params.id} />
      </div>
    </>
  );
}

