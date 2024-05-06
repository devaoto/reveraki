import { cache } from '@/functions/cache';
import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

const CACHE_TIMEOUT_SECONDS = 3600;

interface MalSyncRes {
  id: number;
  type: string;
  title: string;
  url: string;
  total: null | number;
  image: string;
  anidbId: number;
  Sites: {
    [site: string]: {
      [key: string]: {
        identifier: string | number;
        image: string;
        malId: number;
        aniId: number;
        page: string;
        title: string;
        type: string;
        url: string;
        external?: boolean;
      };
    };
  };
}

interface Track {
  file: string;
  label?: string;
  kind: string;
  default?: boolean;
}

interface Interval {
  start: number;
  end: number;
}

interface Source {
  url: string;
  type: string;
}

interface AnimeMetadata {
  tracks: Track[];
  intro?: Interval;
  outro?: Interval;
  sources: Source[];
  anilistID: number;
  malID: number;
}

const getZoroId = async (malId: string) => {
  try {
    const cacheKey = `thumbails:zoroId_${malId}`;
    let zoroId = await cache.get(cacheKey);

    if (!zoroId) {
      const res = (
        await axios.get(`https://api.malsync.moe/mal/anime/${malId}`)
      ).data as MalSyncRes;
      const zoro = res.Sites['Zoro'];

      for (const key in zoro) {
        const zoroInfo = zoro[key];
        zoroId = (await zoroInfo.url.split('/')[3]) as string;
        cache.set(cacheKey, zoroId, CACHE_TIMEOUT_SECONDS);
        break;
      }
    }
    return zoroId;
  } catch (error) {
    return null;
  }
};

interface HiAnimeEpisode {
  title: string;
  episodeId: string;
  number: number;
  isFiller: boolean;
}

interface HiAnime {
  totalEpisodes: number;
  episodes: HiAnimeEpisode[];
}

export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } },
) => {
  try {
    const url = new URL(request.url);
    const episodeNumber = parseInt(url.searchParams.get('episodeNumber') || '');
    const isDub = url.searchParams.get('category') === 'dub';

    const query = `query Query($mediaId: Int) {
          Media(id: $mediaId) {
            idMal
          }
        }`;

    const malIdResponse = await axios.post('https://graphql.anilist.co', {
      query,
      variables: { mediaId: parseInt(params.id) },
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    const malId = malIdResponse.data.data.Media.idMal;

    const zoroId = await getZoroId(malId);
    const hiAnimeResResponse = await axios.get(
      `${process.env.HIANIME_API}/anime/episodes/${zoroId}`,
    );
    const hiAnimeRes = hiAnimeResResponse.data as HiAnime;

    const foundEpisode = hiAnimeRes.episodes.find(
      (e) => e.number === episodeNumber,
    );

    const cacheKey = `thumbnails:episodeSources_${foundEpisode?.episodeId}_${isDub ? 'dub' : 'sub'}`;
    let sources = JSON.parse(await cache.get(cacheKey)) as AnimeMetadata;

    if (!sources) {
      const sourcesResponse = await axios.get(
        `${process.env.HIANIME_API}/anime/episode-srcs?id=${foundEpisode?.episodeId}&server=vidstreaming&category=${isDub ? 'dub' : 'sub'}`,
      );
      sources = sourcesResponse.data as AnimeMetadata;
      cache.set(cacheKey, JSON.stringify(sources), CACHE_TIMEOUT_SECONDS);
    }

    return NextResponse.json(
      await sources.tracks.find((t) => t.kind === 'thumbnails'),
    );
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
