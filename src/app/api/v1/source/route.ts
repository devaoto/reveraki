import axios from 'axios';
import { NextResponse, NextRequest } from 'next/server';

async function consumetEpisode(id: string, provider = 'gogoanime') {
  try {
    const { data } = await axios.get(
      `${process.env.CONSUMET_API}/meta/anilist/watch/${id}?provider=${provider}`,
    );
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function anifyEpisode(
  provider: string,
  episodeid: string,
  epnum: string,
  id: string,
  subtype: string,
) {
  try {
    const { data } = await axios.get(
      `https://api.anify.tv/sources?providerId=${provider}&watchId=${encodeURIComponent(
        episodeid,
      )}&episodeNumber=${epnum}&id=${id}&subType=${subtype}`,
    );
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export const GET = async (req: NextRequest) => {
  const url = new URL(req.url);
  const id = url.searchParams.get('id') as string;
  const source = url.searchParams.get('source') as string;
  const provider = url.searchParams.get('provider') as string;
  const episodeid = url.searchParams.get('episodeid') as string;
  const episodenum = url.searchParams.get('episodenum') as string;
  const subtype = url.searchParams.get('subtype') as string;

  let data;

  if (source === 'consumet') {
    data = await consumetEpisode(episodeid, provider ? provider : undefined);
  }

  if (source === 'anify') {
    data = await anifyEpisode(provider, episodeid, episodenum, id, subtype);
  }

  return NextResponse.json(data);
};
