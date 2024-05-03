'use client';

import { getPopularAnime } from '@/functions/clientRequests';
import { ConsumetAnimePage, ExtendedAnimePage } from '@/types/consumet';
import { useEffect, useState } from 'react';
import { Card } from './Card';
import { Pagination } from '@nextui-org/react';

export default function Popular() {
  const [page, setPage] = useState(1);
  const [popular, setPopular] = useState<ExtendedAnimePage | null>(null);

  useEffect(() => {
    fetchPopularAnime(page);
  }, [page]);

  const fetchPopularAnime = async (currentPage: number) => {
    const response = await getPopularAnime(currentPage, 46);
    setPopular(response!);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div className="overflow-x-hidden">
      <div className="grid grid-cols-2 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
        {popular?.results.map((a) => {
          return <Card key={a.id} anime={a} />;
        })}
      </div>
      <div className="mt-10">
        {popular && (
          <Pagination
            total={popular.totalPages}
            initialPage={page}
            onChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
}
