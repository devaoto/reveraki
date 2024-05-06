import { Cards } from '@/components/Card';
import { use } from 'react';
import {
  getPopularAnime,
  getSeasonalAnime,
  getTrendingAnime,
} from '@/functions/requests';
import { CiStar } from 'react-icons/ci';
import { FaFire } from 'react-icons/fa6';
import { getCurrentSeason } from '@/functions/utilityFunctions';
import { GiButterfly, GiPalmTree, GiTreeBranch } from 'react-icons/gi';
import { FaTree } from 'react-icons/fa';
import { capitalizeFirstLetter } from '@/functions/utilityFunctions';
import { ConsumetAnimePage } from '@/types/consumet';
import dynamic from 'next/dynamic';
const Hero = dynamic(() => import('@/components/Hero'), { ssr: false });

export const revalidate = 1 * 60 * 60;

export default function Home() {
  const [trendingAnime, popularAnime, seasonalAnime] = use(
    Promise.all([
      getTrendingAnime() as Promise<ConsumetAnimePage>,
      getPopularAnime() as Promise<ConsumetAnimePage>,
      getSeasonalAnime() as Promise<ConsumetAnimePage>,
    ]),
  );
  const currentSeason = getCurrentSeason();

  return (
    <>
      <Hero data={trendingAnime} />
      <div className="mt-20">
        <div
          style={{ color: trendingAnime.results[0].color }}
          className="mt-2 flex items-center gap-1 text-lg font-bold md:text-xl lg:text-2xl"
        >
          <FaFire /> <h1>Trending Anime</h1>
        </div>
        <Cards data={trendingAnime} />
        <div
          style={{ color: popularAnime.results[0].color }}
          className="mt-2 flex items-center gap-1 text-lg font-bold md:text-xl lg:text-2xl"
        >
          <CiStar /> <h1>All Time Popular</h1>
        </div>
        <Cards data={popularAnime} />
        <div
          style={{ color: seasonalAnime.results[0].color }}
          className="mt-2 flex items-center gap-1 text-lg font-bold md:text-xl lg:text-2xl"
        >
          {currentSeason === 'FALL' ? (
            <GiTreeBranch />
          ) : currentSeason === 'SUMMER' ? (
            <GiPalmTree />
          ) : currentSeason === 'WINTER' ? (
            <FaTree />
          ) : (
            <GiButterfly />
          )}{' '}
          <h1>This {capitalizeFirstLetter(currentSeason)}</h1>
        </div>
        <Cards data={seasonalAnime} />
      </div>
    </>
  );
}

