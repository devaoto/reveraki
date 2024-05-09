import { StudioInfo } from '@/app/api/v2/studios/[id]/route';
import { getStudio } from '@/functions/requests';
import { Card } from './Card';

export default async function Studio({ params }: { params: { id: string } }) {
  const studio = (await getStudio(params.id)) as StudioInfo;

  return (
    <div className="container ml-5">
      <div>
        <h1 className="text-3xl font-bold">{studio.name}</h1>
        <p>
          {studio.favoritesNumber}{' '}
          {studio.isAnimationStudio ? '| Animation Studio' : ''}
        </p>
      </div>
      <h1 className="mt-10 text-3xl font-bold">Released Anime</h1>
      <div className="mt-10 grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
        {studio.releasedAnime?.map((anime) => (
          <div key={anime.id}>
            <Card anime={anime as unknown as any} />
          </div>
        ))}
      </div>
    </div>
  );
}
