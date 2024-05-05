import { cache } from '@/functions/cache';
import { NextRequest, NextResponse } from 'next/server';

type Params = {
  params: {
    id: string;
  };
};

interface Prms {
  id: string;
}

interface VoiceActor {
  name: string;
  image: string;
}
interface ConsumetVoiceActor {
  id: number;
  language: string;
  name: ConsumetName;
  image: string;
  imageHash: string;
}

interface ConsumetCharacter {
  id: number;
  role: string;
  name: ConsumetName;
  image: string;
  imageHash: string;
  voiceActors: ConsumetVoiceActor[];
}
interface ConsumetName {
  first: string;
  last: string;
  full: string;
  native: string | null;
  userPreferred: string;
}

interface Character {
  name: string;
  image: string;
  voiceActor: VoiceActor;
}

function convertToVoiceActor(
  consumetVoiceActor: ConsumetVoiceActor,
): VoiceActor {
  return {
    name: consumetVoiceActor.name.first + ' ' + consumetVoiceActor.name.last,
    image: consumetVoiceActor.image,
  };
}

function convertToCharacter(
  consumetCharacter: ConsumetCharacter,
): Character | null {
  const originalVoiceActor = consumetCharacter.voiceActors.find(
    (vo) => vo.language === 'Japanese',
  );
  if (!originalVoiceActor) return null;

  return {
    name: consumetCharacter.name.first + ' ' + consumetCharacter.name.last,
    image: consumetCharacter.image,
    voiceActor: convertToVoiceActor(originalVoiceActor),
  };
}

const defaultResponse = {
  slug: null,
  id: null,
  title: {
    native: null,
    romaji: null,
    english: null,
  },
  coverImage: null,
  bannerImage: null,
  trailer: null,
  status: null,
  season: null,
  studios: null,
  currentEpisode: null,
  mappings: null,
  synonyms: null,
  countryOfOrigin: null,
  description: null,
  duration: null,
  color: null,
  year: null,
  recommendations: null,
  rating: {
    anilist: null,
    mal: null,
    tmdb: null,
  },
  popularity: null,
  type: null,
  format: null,
  relations: null,
  totalEpisodes: null,
  genres: null,
  tags: null,
  episodes: null,
  averageRating: null,
  averagePopularity: null,
  artwork: null,
  characters: null,
};

const fetchAnilistInfo = async (params: Prms) => {
  try {
    const query = `query ($id: Int) {
            Media(id: $id) {
              id
              idMal
              title {
                english
                native
                romaji
                userPreferred
              }
              synonyms
              countryOfOrigin
              isLicensed
              isAdult
              externalLinks {
                url
                site
                type
                language
              }
              coverImage {
                extraLarge
                large
                color
              }
              startDate {
                year
                month
                day
              }
              endDate {
                year
                month
                day
              }
              bannerImage
              season
              seasonYear
              description
              type
              format
              status(version: 2)
              episodes
              duration
              chapters
              volumes
              trailer {
                id
                site
                thumbnail
              }
              genres
              source
              averageScore
              popularity
              meanScore
              nextAiringEpisode {
                airingAt
                timeUntilAiring
                episode
              }
              characters(sort: ROLE) {
                edges {
                  role
                  node {
                    id
                    name {
                      first
                      middle
                      last
                      full
                      native
                      userPreferred
                    }
                    image {
                      large
                      medium
                    }
                  }
                  voiceActors {
                    image {
                      large
                      medium
                    }
                    name {
                      first
                      middle
                      last
                      full
                      native
                      alternative
                      userPreferred
                    }
                  }
                }
              }
              recommendations {
                edges {
                  node {
                    id
                    mediaRecommendation {
                      id
                      idMal
                      title {
                        romaji
                        english
                        native
                        userPreferred
                      }
                      status(version: 2)
                      episodes
                      coverImage {
                        extraLarge
                        large
                        medium
                        color
                      }
                      bannerImage
                      format
                      chapters
                      meanScore
                      nextAiringEpisode {
                        episode
                        timeUntilAiring
                        airingAt
                      }
                    }
                  }
                }
              }
              relations {
                edges {
                  id
                  relationType
                  node {
                    id
                    idMal
                    status(version: 2)
                    coverImage {
                      extraLarge
                      large
                      medium
                      color
                    }
                    bannerImage
                    title {
                      romaji
                      english
                      native
                      userPreferred
                    }
                    episodes
                    chapters
                    format
                    nextAiringEpisode {
                      airingAt
                      timeUntilAiring
                      episode
                    }
                    meanScore
                  }
                }
              }
              studios(isMain: true) {
                edges {
                  isMain
                  node {
                    id
                    name
                  }
                }
              }
            }
          }`;

    const response = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables: { id: params.id } }),
    });

    const responseData = await response.json();
    const d = responseData;

    const animeInfo: any = {};

    animeInfo.malId = d.data?.Media?.idMal;
    animeInfo.title = {
      romaji: d.data.Media.title.romaji,
      english: d.data.Media.title.english,
      native: d.data.Media.title.native,
      userPreferred: d.data.Media.title.userPreferred,
    };

    animeInfo.synonyms = d.data?.Media?.synonyms;
    animeInfo.isLicensed = d.data?.Media?.isLicensed ?? undefined;
    animeInfo.isAdult = d.data?.Media?.isAdult ?? undefined;
    animeInfo.countryOfOrigin = d.data?.Media?.countryOfOrigin ?? undefined;

    if (d.data?.Media?.trailer?.id) {
      animeInfo.trailer = {
        id: d.data.Media.trailer.id,
        site: d.data.Media.trailer?.site,
        thumbnail: d.data.Media.trailer?.thumbnail,
      };
    }
    animeInfo.image =
      d.data?.Media?.coverImage?.extraLarge ??
      d.data?.Media?.coverImage?.large ??
      d.data?.Media?.coverImage?.medium;

    animeInfo.popularity = d.data?.Media?.popularity;
    animeInfo.color = d.data?.Media?.coverImage?.color;
    animeInfo.cover = d.data?.Media?.bannerImage;
    animeInfo.description = d.data?.Media?.description;
    switch (d.data?.Media?.status) {
      case 'RELEASING':
        animeInfo.status = 'RELEASING';
        break;
      case 'FINISHED':
        animeInfo.status = 'FINISHED';
        break;
      case 'NOT_YET_RELEASED':
        animeInfo.status = 'NOT_YET_RELEASED';
        break;
      case 'CANCELLED':
        animeInfo.status = 'CANCELLED';
        break;
      case 'HIATUS':
        animeInfo.status = 'HIATUS';
      default:
        animeInfo.status = 'UNKNOWN';
    }
    animeInfo.releaseDate = d.data?.Media?.startDate?.year;
    animeInfo.startDate = {
      year: d.data.Media.startDate.year,
      month: d.data.Media.startDate.month,
      day: d.data.Media.startDate.day,
    };
    animeInfo.endDate = {
      year: d.data.Media.endDate.year,
      month: d.data.Media.endDate.month,
      day: d.data.Media.endDate.day,
    };
    animeInfo.averageRating = d.data.Media.averageScore;
    if (d.data.Media.nextAiringEpisode?.airingAt)
      animeInfo.nextAiringEpisode = {
        airingTime: d.data.Media.nextAiringEpisode?.airingAt,
        timeUntilAiring: d.data.Media.nextAiringEpisode?.timeUntilAiring,
        episode: d.data.Media.nextAiringEpisode?.episode,
      };
    animeInfo.totalEpisodes =
      d.data.Media?.episodes ?? d.data.Media.nextAiringEpisode?.episode - 1;
    animeInfo.currentEpisode = d.data.Media?.nextAiringEpisode?.episode
      ? d.data.Media.nextAiringEpisode?.episode - 1
      : d.data.Media?.episodes;
    animeInfo.rating = d.data.Media.averageScore;
    animeInfo.duration = d.data.Media.duration;
    animeInfo.genres = d.data.Media.genres;
    animeInfo.season = d.data.Media.season;
    animeInfo.studios = d.data.Media.studios.edges.map(
      (item: any) => item.node.name,
    );
    animeInfo.type = d.data.Media.format;
    animeInfo.recommendations = d.data.Media?.recommendations?.edges?.map(
      (item: any) => ({
        id: item.node.mediaRecommendation?.id,
        malId: item.node.mediaRecommendation?.idMal,
        title: {
          romaji: item.node.mediaRecommendation?.title?.romaji,
          english: item.node.mediaRecommendation?.title?.english,
          native: item.node.mediaRecommendation?.title?.native,
          userPreferred: item.node.mediaRecommendation?.title?.userPreferred,
        },
        status:
          item.node.mediaRecommendation?.status == 'RELEASING'
            ? 'RELEASING'
            : item.node.mediaRecommendation?.status == 'FINISHED'
              ? 'FINISHED'
              : item.node.mediaRecommendation?.status == 'NOT_YET_RELEASED'
                ? 'NOT_YET_RELEASED'
                : item.node.mediaRecommendation?.status == 'CANCELLED'
                  ? 'CANCELLED'
                  : item.node.mediaRecommendation?.status == 'HIATUS'
                    ? 'HIATUS'
                    : 'UNKNOWN',
        episodes: item.node.mediaRecommendation?.episodes,
        image:
          item.node.mediaRecommendation?.coverImage?.extraLarge ??
          item.node.mediaRecommendation?.coverImage?.large ??
          item.node.mediaRecommendation?.coverImage?.medium,
        cover:
          item.node.mediaRecommendation?.bannerImage ??
          item.node.mediaRecommendation?.coverImage?.extraLarge ??
          item.node.mediaRecommendation?.coverImage?.large ??
          item.node.mediaRecommendation?.coverImage?.medium,
        rating: item.node.mediaRecommendation?.meanScore,
        type: item.node.mediaRecommendation?.format,
      }),
    );

    animeInfo.characters = d.data?.Media?.characters?.edges?.map(
      (item: any) => ({
        id: item.node?.id,
        role: item.role,
        name: {
          first: item.node.name.first,
          last: item.node.name.last,
          full: item.node.name.full,
          native: item.node.name.native,
          userPreferred: item.node.name.userPreferred,
        },
        image: item.node.image.large ?? item.node.image.medium,
        voiceActors: item.voiceActors.map((voiceActor: any) => ({
          id: voiceActor.id,
          language: voiceActor.languageV2,
          name: {
            first: voiceActor.name.first,
            last: voiceActor.name.last,
            full: voiceActor.name.full,
            native: voiceActor.name.native,
            userPreferred: voiceActor.name.userPreferred,
          },
          image: voiceActor.image.large ?? voiceActor.image.medium,
        })),
      }),
    );

    animeInfo.relations = d.data?.Media?.relations?.edges?.map((item: any) => ({
      id: item.node.id,
      relationType: item.relationType,
      malId: item.node.idMal,
      title: {
        romaji: item.node.title.romaji,
        english: item.node.title.english,
        native: item.node.title.native,
        userPreferred: item.node.title.userPreferred,
      },
      status:
        item.node.status == 'RELEASING'
          ? 'RELEASING'
          : item.node.status == 'FINISHED'
            ? 'FINISHED'
            : item.node.status == 'NOT_YET_RELEASED'
              ? 'NOT_YET_RELEASED'
              : item.node.status == 'CANCELLED'
                ? 'CANCELLED'
                : item.node.status == 'HIATUS'
                  ? 'HIATUS'
                  : 'UNKNOWN',
      episodes: item.node.episodes,
      image:
        item.node.coverImage.extraLarge ??
        item.node.coverImage.large ??
        item.node.coverImage.medium,
      color: item.node.coverImage?.color,
      type: item.node.format,
      cover:
        item.node.bannerImage ??
        item.node.coverImage.extraLarge ??
        item.node.coverImage.large ??
        item.node.coverImage.medium,
      rating: item.node.meanScore,
    }));

    return animeInfo as any;
  } catch (error) {
    return defaultResponse;
  }
};

export const GET = async (
  request: NextRequest,
  { params }: Readonly<Params>,
) => {
  try {
    const cacheKey = `anilistInfo:${params.id}`;
    let info: any = await cache.get(cacheKey);

    if (!info) {
      info = await fetchAnilistInfo(params);
      await cache.set(cacheKey, JSON.stringify(info), 5 * 60 * 60);
    } else {
      info = JSON.parse(info);
    }

    let trailer;

    try {
      trailer = `https://www.${info.trailer.site}.com/watch?v=${info.trailer.id}`;
    } catch (error) {
      trailer = null;
    }

    return NextResponse.json({
      slug: info.title.romaji.toLowerCase().replace(/[^a-zA-Z0-9]+/g, '-'),
      id: info.id,
      malId: info.malId,
      title: {
        native: info.title.native,
        romaji: info.title.romaji,
        english: info.title.english,
      },
      coverImage: info.cover,
      bannerImage: info.image,
      trailer: trailer,
      status: info.status,
      startDate: info.startDate,
      season: info.season,
      studios: info.studios,
      currentEpisode: info.currentEpisode ?? 0,
      mappings: info.mappings ?? [],
      synonyms: info.synonyms,
      countryOfOrigin: info.countryOfOrigin,
      description: info.description,
      duration: info.duration,
      color: info.color,
      year: info.releaseDate,
      recommendations: info.recommendations,
      rating: {
        anilist: info.rating / 10,
        mal: 0,
        tmdb: 0,
      },
      popularity: { mal: 0, tmdb: 0, anilist: info.popularity } ?? {
        mal: 0,
        tmdb: 0,
        anilist: 0,
      },
      type: info.type,
      format: info.format ?? '',
      relations: info.relations,
      totalEpisodes: info.totalEpisodes,
      genres: info.genres,
      tags: info.tags ?? [],
      episodes: info.episodes ?? [],
      averageRating: info.averageRating,
      averagePopularity: info.averagePopularity ?? 0,
      artwork: info.artwork ?? [],
      characters: info.characters.map(convertToCharacter).filter(Boolean),
    });
  } catch (error) {
    console.error('Error fetching info', (error as Error).message);
    return NextResponse.json(
      {
        message: 'Internal Server Error',
        status: 500,
      },
      { status: 500 },
    );
  }
};
