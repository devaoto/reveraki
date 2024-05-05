import { NextRequest, NextResponse } from 'next/server';
import { cache } from '@/functions/cache';
import axios from 'axios';
import {
  EpisodeConsumet,
  IEpisode,
  convertToEpisode,
} from '@/functions/utilityFunctions';

type Params = {
  params: {
    id: string;
  };
};

interface Episode {
  id: string;
  img: string | null;
  title: string;
  hasDub: boolean;
  number: number;
  rating: number | null;
  isFiller: boolean;
  updatedAt: number;
  description: string | null;
}

interface Provider {
  episodes: Episode[];
  providerId: string;
}

interface MetadataEpisode {
  id: string;
  description: string;
  hasDub: boolean;
  img: string;
  isFiller: boolean;
  number: number;
  title: string;
  updatedAt: number;
  rating: number;
}

interface EpisodeMetadata {
  number: number;
  title: string;
  fullTitle: string;
  thumbnail: string;
}

interface EpTitle {
  english: string;
  romaji: string;
  native: string;
}

interface AnimeData {
  metadatas: EpisodeMetadata[];
  title: EpTitle;
}

interface MetadataProviderData {
  providerId: string;
  data: MetadataEpisode[];
}

export const revalidate = 1 * 60 * 60;

const getOrSetCache = async (key: string, fetchData: Function) => {
  const cachedData = await cache.get(key);

  if (cachedData) {
    return JSON.parse(cachedData);
  } else {
    const freshData = await fetchData();
    await cache.set(key, JSON.stringify(freshData), 3600);
    return freshData;
  }
};

const findEpisodeData = (
  episodes: Episode[],
  information: any,
  metadata?: AnimeData,
  episodeImages?: MetadataProviderData[] | undefined,
): any => {
  try {
    return episodes.map((episode) => {
      // Find the image data for the episode
      let foundImage = null;
      try {
        foundImage = episodeImages
          ?.find(
            (imageData) => imageData.providerId === 'tvdb' || episodeImages[0],
          )
          ?.data.find((data) => episode.number === data.number);
      } catch (error) {
        foundImage = null;
      }

      // Find the metadata for the episode
      const foundMetadata = metadata?.metadatas.find(
        (meta) => meta.number === episode.number,
      );

      // Construct episode information
      const img = foundImage?.img ?? information.coverImage ?? episode.img;

      // Construct episode title
      const title =
        episode.title && !episode.title.startsWith('EP')
          ? episode.title
          : foundImage?.title ?? `Episode ${episode.number}`;

      // Construct episode description
      const ordinal =
        episode.number === 1
          ? '1st'
          : episode.number === 2
            ? '2nd'
            : episode.number === 3
              ? '3rd'
              : `${episode.number}th`;
      const description =
        episode.description ??
        foundImage?.description ??
        `${ordinal} Episode of ${
          information.title.english ??
          information.title.romaji ??
          information.title.native
        }`;

      return {
        id: episode.id,
        img,
        title,
        description,
        number: episode.number,
      };
    });

    // Error finding metadata:
  } catch (error) {
    return episodes.map((episode) => {
      // Find the metadata for the episode
      const foundMetadata = metadata?.metadatas.find(
        (meta) => meta.number === episode.number,
      );

      // Construct episode information
      const img = information.coverImage ?? episode.img;

      // Construct episode title
      const title =
        episode.title && !episode.title.startsWith('EP')
          ? episode.title
          : `Episode ${episode.number}`;

      // Construct episode description
      const ordinal =
        episode.number === 1
          ? '1st'
          : episode.number === 2
            ? '2nd'
            : episode.number === 3
              ? '3rd'
              : `${episode.number}th`;
      const description =
        episode.description ??
        `${ordinal} Episode of ${
          information.title.english ??
          information.title.romaji ??
          information.title.native
        }`;

      return {
        id: episode.id,
        img,
        title,
        description,
        number: episode.number,
      };
    });
  }
};

export const GET = async (request: NextRequest, { params }: Params) => {
  try {
    const cacheKey = `tempEpisodes:${params.id}`;
    const cachedEpisodes = await getOrSetCache(cacheKey, async () => {
      let consumetEpisodes: EpisodeConsumet[] = [];
      let information = await axios
        .get(`${process.env.NEXT_PUBLIC_DOMAIN}/api/v1/info/${params.id}`)
        .catch((e) => undefined);

      try {
        consumetEpisodes = (
          await axios.get(
            `${process.env.CONSUMET_API}/meta/anilist/episodes/${params.id}`,
          )
        ).data;
      } catch (consumetError) {
        console.error(
          'Error fetching episodes from consumet API:',
          consumetError,
        );
        return NextResponse.json(
          {
            message: 'Internal Server Error',
            status: 500,
          },
          { status: 500 },
        );
      }

      let convertedEpisodes: IEpisode[] | undefined;

      if (consumetEpisodes.length > 0) {
        convertedEpisodes = consumetEpisodes.map(convertToEpisode);
      } else {
        convertedEpisodes = [];
      }

      let ceps;

      if (convertedEpisodes.length > 0) {
        ceps = [
          {
            episodes: findEpisodeData(
              convertedEpisodes as Episode[],
              information?.data,
              undefined, // Pass undefined for metadata as it's not available from Consumet API
              undefined, // Pass undefined for episodeImages as it's not available from Consumet API
            ),
            providerId: 'anizone',
          },
        ];
      } else {
        ceps = [
          {
            episodes: [],
            providerId: 'anizone',
          },
        ];
      }

      return ceps;
    });

    return NextResponse.json(cachedEpisodes);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: 'Internal Server Error',
        status: 500,
      },
      { status: 500 },
    );
  }
};
