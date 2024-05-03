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
  consumetVoiceActor: ConsumetVoiceActor
): VoiceActor {
  return {
    name: consumetVoiceActor.name.first + ' ' + consumetVoiceActor.name.last,
    image: consumetVoiceActor.image,
  };
}

function convertToCharacter(
  consumetCharacter: ConsumetCharacter
): Character | null {
  const originalVoiceActor = consumetCharacter.voiceActors.find(
    (vo) => vo.language === 'Japanese'
  );

  if (!originalVoiceActor) return null;

  return {
    name:
      consumetCharacter.name.first +
      ' ' +
      (consumetCharacter.name.last ? consumetCharacter.name.last : ''),
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
  characters: [],
};

const fetchAnilistInfo = async (params: Prms) => {
  try {
    const query = `query Page($mediaId: Int) {
      Media(id: $mediaId) {
        title {
            english
            romaji
            native
        }
        characters {
          edges {
            name
            role
            node {
              name {
                first
                middle
                last
                full
                native
                alternative
                alternativeSpoiler
                userPreferred
              }
              image {
                large
                medium
              }
            }
            voiceActors {
              name {
                first
                middle
                last
                full
                native
                alternative
                userPreferred
              }
              image {
                large
                medium
              }
              languageV2
              id
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
      body: JSON.stringify({ query, variables: { mediaId: params.id } }),
    });

    const responseData = await response.json();
    const d = responseData;

    const animeInfo: any = {};

    animeInfo.title = {
      romaji: d.data.Media.title.romaji,
      english: d.data.Media.title.english,
      native: d.data.Media.title.native,
    };

    animeInfo.characters = d.data?.Media?.characters?.edges?.map(
      (item: any) => ({
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
      })
    );

    return animeInfo as any;
  } catch (error) {
    console.error(error);
    return defaultResponse;
  }
};

export const GET = async (
  request: NextRequest,
  { params }: Readonly<Params>
) => {
  try {
    const cacheKey = `anilistcharactersc:${params.id}`;
    let info: any = await cache.get(cacheKey);

    if (!info) {
      info = await fetchAnilistInfo(params);
      await cache.set(cacheKey, JSON.stringify(info), 5 * 60 * 60);
    } else {
      info = JSON.parse(info);
    }

    return NextResponse.json({
      id: params.id,
      title: {
        native: info.title.native,
        romaji: info.title.romaji,
        english: info.title.english,
      },
      characters: info.characters.map(convertToCharacter).filter(Boolean),
    });
  } catch (error) {
    console.error('Error fetching info', (error as Error).message);
    return NextResponse.json(
      {
        message: 'Internal Server Error',
        status: 500,
      },
      { status: 500 }
    );
  }
};
