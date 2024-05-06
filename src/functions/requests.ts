'use server';

import { getCurrentSeason } from './utilityFunctions';
import { cache } from './cache';
import { SiteAnime, SiteEpisode } from '@/types/site';

const FetchDataAndCache = async (
  url: string,
  id: string,
  method?: string,
  headers?: Record<string, string>,
  body?: any,
) => {
  try {
    let isCached = false;
    let data: any = await cache.get(`${url}:${id}`);

    if (!data) {
      const options: RequestInit = {
        cache: 'no-cache',
        method: method ? method : 'GET',
        headers: headers ? new Headers(headers) : undefined,
        body: body ? body : undefined,
      };

      data = await (await fetch(url, options)).json();
      await cache.set(`${url}i:${id}`, JSON.stringify(data), 5 * 60 * 60);
      isCached = true;
    } else {
      data = JSON.parse(data);
      isCached = true;
    }

    return { ...data, isCached };
  } catch (error) {
    return error;
  }
};

export const getTrendingAnime = async (page = 1, perPage = 24) => {
  const query = `query ($page: Int, $isAdult: Boolean = false, $size: Int, $sort: [MediaSort] = [TRENDING_DESC, POPULARITY_DESC], $type: MediaType) {
        Page(page: $page, perPage: $size) {
          pageInfo {
            total
            perPage
            currentPage
            lastPage
            hasNextPage
          }
          media(isAdult: $isAdult, sort: $sort, type: $type) {
            id
            idMal
            status(version: 2)
            title {
              userPreferred
              romaji
              english
              native
            }
            genres
            trailer {
              id
              site
              thumbnail
            }
            description
            format
            bannerImage
            coverImage {
              extraLarge
              large
              medium
              color
            }
            episodes
            meanScore
            duration
            season
            seasonYear
            averageScore
            nextAiringEpisode {
              airingAt
              timeUntilAiring
              episode
            }
            type
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
          }
        }
      }      
      `;

  const variables = {
    isAdult: false,
    page: page,
    size: perPage,
    type: 'ANIME',
  };

  let response;

  try {
    response = await FetchDataAndCache(
      `https://graphql.anilist.co`,
      'trending2',
      'POST',
      {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      JSON.stringify({ query, variables }),
    );

    const res: any = {
      currentPage: response.data.Page.pageInfo.currentPage,
      hasNextPage: response.data.Page.pageInfo.hasNextPage,
      results: response.data.Page.media
        .filter((item: any) => item.status !== 'NOT_YET_RELEASED')
        .map((item: any) => ({
          id: item.id.toString(),
          malId: item.idMal,
          title:
            {
              romaji: item.title.romaji,
              english: item.title.english,
              native: item.title.native,
              userPreferred: item.title.userPreferred,
            } || item.title.romaji,
          image:
            item.coverImage.extraLarge ??
            item.coverImage.large ??
            item.coverImage.medium,
          trailer: {
            id: item.trailer?.id,
            site: item.trailer?.site,
            thumbnail: item.trailer?.thumbnail,
          },
          description: item.description,
          status: item.status,
          cover:
            item.bannerImage ??
            item.coverImage.extraLarge ??
            item.coverImage.large ??
            item.coverImage.medium,
          rating: item.averageScore,
          meanScore: item.meanScore,
          releaseDate: item.seasonYear,
          startDate: {
            year: item.startDate.year,
            month: item.startDate.month,
            day: item.startDate.day,
          },
          color: item.coverImage?.color,
          genres: item.genres,
          totalEpisodes: isNaN(item.episodes)
            ? 0
            : item.episodes ?? item.nextAiringEpisode?.episode - 1 ?? 0,
          duration: item.duration,
          type: item.format,
        })),
    };

    return res;
  } catch (error) {
    try {
      console.log(
        'There was an error fetching trending from anilist. Using consumet....',
      );
      response = await FetchDataAndCache(
        `${process.env.NEXT_PUBLIC_CONSUMET_API}/trending?perPage=${perPage}&page=${page}`,
        'trending3',
      );
      return await response;
    } catch (error) {
      console.error(error);
    }
  }
};

export const getPopularAnime = async () => {
  const query = `query ($page: Int, $isAdult: Boolean = false, $size: Int, $sort: [MediaSort] = [POPULARITY_DESC], $type: MediaType) {
        Page(page: $page, perPage: $size) {
          pageInfo {
            total
            perPage
            currentPage
            lastPage
            hasNextPage
          }
          media(isAdult: $isAdult, sort: $sort, type: $type) {
            id
            idMal
            status(version: 2)
            title {
              userPreferred
              romaji
              english
              native
            }
            genres
            trailer {
              id
              site
              thumbnail
            }
            description
            format
            bannerImage
            coverImage {
              extraLarge
              large
              medium
              color
            }
            episodes
            meanScore
            duration
            season
            seasonYear
            averageScore
            nextAiringEpisode {
              airingAt
              timeUntilAiring
              episode
            }
            type
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
          }
        }
      }      
      `;

  const variables = {
    isAdult: false,
    page: 1,
    size: 35,
    type: 'ANIME',
  };

  let response;

  try {
    response = await FetchDataAndCache(
      `https://graphql.anilist.co`,
      'popular2',
      'POST',
      {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      JSON.stringify({ query, variables }),
    );
    const res: any = {
      currentPage: response.data.Page.pageInfo.currentPage,
      hasNextPage: response.data.Page.pageInfo.hasNextPage,
      results: response.data.Page.media
        .filter((item: any) => item.status !== 'NOT_YET_RELEASED')
        .map((item: any) => ({
          id: item.id.toString(),
          malId: item.idMal,
          title:
            {
              romaji: item.title.romaji,
              english: item.title.english,
              native: item.title.native,
              userPreferred: item.title.userPreferred,
            } || item.title.romaji,
          image:
            item.coverImage.extraLarge ??
            item.coverImage.large ??
            item.coverImage.medium,
          trailer: {
            id: item.trailer?.id,
            site: item.trailer?.site,
            thumbnail: item.trailer?.thumbnail,
          },
          description: item.description,
          status: item.status,
          cover:
            item.bannerImage ??
            item.coverImage.extraLarge ??
            item.coverImage.large ??
            item.coverImage.medium,
          rating: item.averageScore,
          meanScore: item.meanScore,
          releaseDate: item.seasonYear,
          color: item.coverImage?.color,
          genres: item.genres,
          totalEpisodes: isNaN(item.episodes)
            ? 0
            : item.episodes ?? item.nextAiringEpisode?.episode - 1 ?? 0,
          duration: item.duration,
          type: item.format,
        })),
    };

    return res;
  } catch (error) {
    try {
      console.log(
        'There was an error fetching popular from anilist. Using consumet....',
      );

      response = await FetchDataAndCache(
        `${process.env.NEXT_PUBLIC_CONSUMET_API}/popular?perPage=24`,
        'popular3',
      );
      return await response;
    } catch (error) {
      console.error(error);
    }
  }
};

export const getSeasonalAnime = async () => {
  const query = `query ($page: Int, $isAdult: Boolean = false, $size: Int, $type: MediaType, $season: MediaSeason, $seasonYear: Int) {
    Page(page: $page, perPage: $size) {
      pageInfo {
        total
        perPage
        currentPage
        lastPage
        hasNextPage
      }
      media(isAdult: $isAdult, type: $type, season: $season, seasonYear: $seasonYear) {
        id
        idMal
        status(version: 2)
        title {
          userPreferred
          romaji
          english
          native
        }
        genres
        trailer {
          id
          site
          thumbnail
        }
        description
        format
        bannerImage
        coverImage {
          extraLarge
          large
          medium
          color
        }
        episodes
        meanScore
        duration
        season
        seasonYear
        averageScore
        nextAiringEpisode {
          airingAt
          timeUntilAiring
          episode
        }
        type
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
      }
    }
  }    
      `;

  const variables = {
    isAdult: false,
    page: 1,
    size: 35,
    type: 'ANIME',
    season: getCurrentSeason(),
    seasonYear: new Date().getFullYear() ?? 2024,
  };

  let response;

  try {
    response = await FetchDataAndCache(
      `https://graphql.anilist.co`,
      'seasonal2',
      'POST',
      {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      JSON.stringify({ query, variables }),
    );

    const res: any = {
      currentPage: response.data.Page.pageInfo.currentPage,
      hasNextPage: response.data.Page.pageInfo.hasNextPage,
      results: response.data.Page.media
        .filter((item: any) => item.status !== 'NOT_YET_RELEASED')
        .map((item: any) => ({
          id: item.id.toString(),
          malId: item.idMal,
          title:
            {
              romaji: item.title.romaji,
              english: item.title.english,
              native: item.title.native,
              userPreferred: item.title.userPreferred,
            } || item.title.romaji,
          image:
            item.coverImage.extraLarge ??
            item.coverImage.large ??
            item.coverImage.medium,
          trailer: {
            id: item.trailer?.id,
            site: item.trailer?.site,
            thumbnail: item.trailer?.thumbnail,
          },
          description: item.description,
          status: item.status,
          cover:
            item.bannerImage ??
            item.coverImage.extraLarge ??
            item.coverImage.large ??
            item.coverImage.medium,
          rating: item.averageScore,
          meanScore: item.meanScore,
          releaseDate: item.seasonYear,
          color: item.coverImage?.color,
          genres: item.genres,
          totalEpisodes: isNaN(item.episodes)
            ? 0
            : item.episodes ?? item.nextAiringEpisode?.episode - 1 ?? 0,
          duration: item.duration,
          type: item.format,
        })),
    };

    return res;
  } catch (error) {
    try {
      console.log(
        'There was an error fetching seasonal from anilist. Using consumet....',
      );

      response = await FetchDataAndCache(
        `${
          process.env.NEXT_PUBLIC_CONSUMET_API
        }/advanced-search?perPage=24&season=${getCurrentSeason()}&year=${new Date().getFullYear()}`,
        'seasonal3',
      );
      return await response;
    } catch (error) {
      console.error(error);
    }
  }
};

export async function getInfo(id: string) {
  try {
    const response = await FetchDataAndCache(
      `${process.env.NEXT_PUBLIC_DOMAIN}/api/v1/info/${id}`,
      `info:${id}`,
    );
    return await response;
  } catch (error) {
    console.error(error);
  }
}

export async function getEpisodes(id: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_DOMAIN}/api/temp/episodes/${id}`,
    );
    let episodes: SiteEpisode[] | undefined;

    try {
      episodes = ((await response.json()) as SiteAnime[]).find(
        (p) => p.providerId === 'anizone',
      )?.episodes;
    } catch (error) {
      episodes = [];
    }
    return episodes;
  } catch (error) {
    console.error(error);
  }
}

export async function getSources(id: string, episodeId: string) {
  try {
    const response = await FetchDataAndCache(
      `${
        process.env.NEXT_PUBLIC_DOMAIN
      }/api/v1/source?source=consumet&id=${id}&episodeid=${
        episodeId.startsWith('/') ? episodeId.slice(1) : episodeId
      }`,
      `source:${id}i`,
    );
    return await response;
  } catch (error) {
    console.error(error);
  }
}

export async function getCharacters(id: string) {
  try {
    const response = await FetchDataAndCache(
      `${process.env.NEXT_PUBLIC_DOMAIN}/api/v1/characters/${id}`,
      `charOf:${id}i`,
    );
    return await response;
  } catch (error) {
    console.error(error);
  }
}

export async function getThumbnails(id: string, episodeNumber: number) {
  try {
    const response = await FetchDataAndCache(
      `${process.env.NEXT_PUBLIC_DOMAIN}/api/v2/thumbnails/${id}?episodeNumber=${episodeNumber}`,
      `e_thumbails:${id}:ep${episodeNumber}`,
    );
    return await response;
  } catch (error) {
    console.error(error);
  }
}

