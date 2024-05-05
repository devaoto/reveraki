'use client';

import { getTrendingAnime } from '@/functions/clientRequests';
import { ExtendedAnimePage } from '@/types/consumet';
import { useEffect, useState } from 'react';
import { Card } from './Card';
import { Pagination } from '@nextui-org/react';

export default function Trending() {
  const [page, setPage] = useState(1);
  const [trending, setTrending] = useState<ExtendedAnimePage | null>(null);

  useEffect(() => {
    fetchTrendingAnime(page);
  }, [page]);

  const fetchTrendingAnime = async (currentPage: number) => {
    const response = await getTrendingAnime(currentPage, 46);
    setTrending(response!);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div className="overflow-x-hidden">
      <div className="grid grid-cols-2 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
        {trending?.results.map((a) => {
          return <Card key={a.id} anime={a} />;
        })}
      </div>
      <div className="mt-10">
        {trending && (
          <Pagination
            total={trending.totalPages}
            initialPage={page}
            onChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
}
