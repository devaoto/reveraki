import { EpisodesList } from '@/components/EpisodesList';
import Player from '@/components/Player/VidstackPlayer';
import { getInfo, getEpisodes, getSources } from '@/functions/requests';
import { IEpisode } from '@/functions/utilityFunctions';
import { AnimeInfo, SiteEpisode } from '@/types/site';
import { use } from 'react';
import { Accordions } from './Accordions';
import { Metadata, Viewport } from 'next';

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
      <div className="flex flex-col md:flex-row justify-center">
        <div className="md:mr-5 flex-grow max-w-4xl">
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
        <div className="md:mt-10">
          <h1 className="text-3xl font-bold mb-4">Episodes</h1>
          <EpisodesList
            episodes={episode!}
            id={params.id}
            current={Number(params.episode)}
          />
        </div>
      </div>
      <div className="ml-5 mt-10">
        <Accordions info={info!} />
      </div>
    </>
  );
}
