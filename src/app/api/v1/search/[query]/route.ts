import { ConsumetSearchResult } from '@/types/consumet';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (
  request: NextRequest,
  { params }: { params: { query: string } }
) => {
  try {
    const h = request.headers;

    if (!h.get('x-site') || h.get('x-site') !== 'ezanime') {
      return NextResponse.json(
        {
          message: 'Bad Request',
          status: 400,
        },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${process.env.CONSUMET_API!}/meta/anilist/${params.query}?perPage=10`
    );
    return NextResponse.json((await response.json()) as ConsumetSearchResult);
  } catch (error) {
    return NextResponse.json(
      {
        message: 'Internal Server Error',
        status: 500,
      },
      { status: 500 }
    );
  }
};
