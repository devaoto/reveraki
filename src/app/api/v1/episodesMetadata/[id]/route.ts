import { NextRequest, NextResponse } from 'next/server';
import { cache } from '@/functions/cache';

type Params = {
  params: {
    id: string;
  };
};

export const GET = async (
  request: NextRequest,
  { params }: Readonly<Params>,
) => {
  try {
    const cachedData = await cache.get(`em1:${params.id}`);
    if (cachedData) {
      return NextResponse.json(JSON.parse(cachedData));
    }

    const query = `query Page($mediaId: Int) {
        Media(id: $mediaId) {
          title {
              english
              romaji
              native
          }
          streamingEpisodes {
            title
            thumbnail
            url
            site
          }
        }
      }`;

    const response = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: { mediaId: parseInt(params.id) },
      }),
    });

    const episodeNumberPattern = /^Episode (\d+)/;

    const responseData = await response.json();

    const formattedRes = {
      metadatas: responseData.data.Media.streamingEpisodes.map(
        (se: {
          title: string;
          thumbnail: string;
          url: string;
          site: string;
        }) => ({
          number: Number(se.title.match(episodeNumberPattern)?.[1]),
          title: se.title.split('-')[1].trim(),
          fullTitle: se.title,
          thumbnail: se.thumbnail,
        }),
      ),
      title: {
        english: responseData.data.Media.title.english,
        romaji: responseData.data.Media.title.romaji,
        native: responseData.data.Media.title.native,
      },
    };

    await cache.set(
      `em1:${params.id}`,
      JSON.stringify(formattedRes),
      5 * 60 * 60,
    );

    return NextResponse.json(formattedRes);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: 'Internal Server Error',
        status: 500,
      },
      { status: 500 },
    );
  }
};
