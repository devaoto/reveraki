import axios from 'axios';
import { cache } from '@/functions/cache';
import { NextRequest, NextResponse } from 'next/server';
import { Title } from '@/types/site';

interface MediaTitle {
  romaji: string;
  english: string | null;
  native: string;
  userPreferred: string;
}

interface MediaTrailer {
  id: string;
  site: string;
  thumbnail: string;
}

interface StartDate {
  year: number;
  month: number;
  day: number;
}

interface CoverImage {
  extraLarge: string;
  large: string;
  medium: string;
  color: string;
}

interface StatusDistribution {
  amount: number;
  status: string;
}

interface MediaNode {
  id: number;
  idMal: number;
  type: string;
  title: MediaTitle;
  trailer: MediaTrailer;
  synonyms: string[];
  status: string;
  startDate: StartDate;
  seasonYear: number;
  season: string;
  meanScore: number;
  format: string;
  bannerImage: string;
  description: string;
  duration: number;
  episodes: number;
  coverImage: CoverImage;
  averageScore: number;
  popularity: number;
  stats: {
    statusDistribution: StatusDistribution[];
  };
}

interface Studio {
  name: string;
  id: number;
  isAnimationStudio: boolean;
  favourites: number;
  media: {
    nodes: MediaNode[];
  };
}

interface Data {
  Studio: Studio;
}

interface Response {
  data: Data;
}

export interface StudioInfo {
  id: string;
  name?: string;
  isAnimationStudio?: boolean;
  favoritesNumber?: number;
  releasedAnime?: {
    id: string;
    malId: string;
    type?: 'ANIME' | 'MANGA';
    title?: Title;
    trailer?: string;
    synonyms?: string[];
    status?:
      | 'FINISHED'
      | 'RELEASING'
      | 'NOT_YET_RELEASED'
      | 'HIATUS'
      | 'CANCELLED';
    startDate?: {
      day: number;
      month: number;
      year: number;
    };
    year?: number;
    season?: 'WINTER' | 'SUMMER' | 'FALL' | 'SPRING';
    meanScore?: number;
    format: 'OVA' | 'ONA' | 'TV' | 'MOVIE' | 'TV_SHORT';
    bannerImage?: string;
    color?: string;
    description?: string;
    coverImage?: string;
    duration?: number;
    totalEpisodes?: number;
    averageScore?: number;
    popularity?: number;
  }[];
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    let sInfo = await cache.get(`studioData:anilist:v2:${params.id}`);

    if (!sInfo) {
      const query = `query Query($studioId: Int) {
            Studio(id: $studioId) {
              name
              id
              isAnimationStudio
              favourites
              media {
                nodes {
                  id
                  idMal
                  type
                  title {
                    romaji
                    english
                    native
                    userPreferred
                  }
                  trailer {
                    id
                    site
                    thumbnail
                  }
                  synonyms
                  status
                  startDate {
                    year
                    month
                    day
                  }
                  seasonYear
                  season
                  meanScore
                  format
                  bannerImage
                  description
                  duration
                  episodes
                  coverImage {
                    extraLarge
                    large
                    medium
                    color
                  }
                  averageScore
                  popularity
                  stats {
                    statusDistribution {
                      amount
                      status
                    }
                  }
                }
              }
            }
          }`;

      const variables = {
        studioId: Number(params.id),
      };

      const res = await axios.post(
        'https://graphql.anilist.co',
        { variables, query },
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      );

      const animeData = (await res.data) as Response;
      let studioInfo: StudioInfo = {
        id: '',
      };

      studioInfo.id = String(animeData.data.Studio.id);
      studioInfo.name = animeData.data.Studio.name;
      studioInfo.favoritesNumber = animeData.data.Studio.favourites;
      studioInfo.isAnimationStudio = animeData.data.Studio.isAnimationStudio;
      studioInfo.releasedAnime = animeData.data.Studio.media.nodes.map(
        (node) => {
          const trailerId = node.trailer ? node.trailer.id : undefined;

          return {
            id: String(node.id) ?? undefined,
            malId: String(node.idMal) ?? undefined,
            format:
              (node.format as 'OVA' | 'ONA' | 'TV' | 'MOVIE' | 'TV_SHORT') ??
              undefined,
            type: (node.type as 'ANIME' | 'MANGA') ?? undefined,
            color: node.coverImage.color ?? undefined,
            coverImage:
              node.coverImage.extraLarge ??
              node.coverImage.large ??
              node.coverImage.medium ??
              undefined,
            bannerImage: node.bannerImage ?? undefined,
            averageScore: node.averageScore ?? undefined,
            meanScore: node.meanScore ?? undefined,
            synonyms: node.synonyms ?? [],
            trailer: trailerId
              ? `https://www.youtube.com/watch?v=${trailerId}`
              : undefined,
            startDate: node.startDate ?? undefined,
            status:
              (node.status as
                | 'RELEASING'
                | 'FINISHED'
                | 'HIATUS'
                | 'CANCELLED'
                | 'NOT_YET_RELEASED') ?? undefined,
            totalEpisodes: node.episodes ?? undefined,
            description: node.description ?? undefined,
            duration: node.duration ?? undefined,
            popularity: node.popularity ?? undefined,
            season:
              (node.season as 'WINTER' | 'SUMMER' | 'FALL' | 'SPRING') ??
              undefined,
            title: {
              english: node.title.english,
              romaji: node.title.romaji,
              native: node.title.native,
              userPreferred: node.title.userPreferred,
            } as Title,
            year: node.seasonYear,
          };
        },
      );

      sInfo = studioInfo;
      await cache.set(
        `studioData:anilist:v2:${params.id}`,
        JSON.stringify(studioInfo),
        5 * 60 * 60,
      );
    } else {
      sInfo = JSON.parse(sInfo);
    }

    return NextResponse.json(sInfo);
  } catch (error) {
    console.error('Error fetching info', error as Error);
    return NextResponse.json(
      {
        message: 'Internal Server Error',
        status: 500,
      },
      { status: 500 },
    );
  }
}
