import { getTrendingAnime } from '@/functions/clientRequests';
import { ConsumetAnimePage } from '@/types/consumet';
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const anime = (await getTrendingAnime()) as ConsumetAnimePage;
  const animeEntries: MetadataRoute.Sitemap = anime.results.map(
    ({ id, title }) => ({
      url: `${process.env.NEXT_PUBLIC_DOMAIN}/watch/${id}/1`,
      lastModefied: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    })
  );

  return [
    {
      url: `${process.env.NEXT_PUBLIC_DOMAIN}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    ...animeEntries,
  ];
}
