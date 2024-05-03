export interface ConsumetAnime {
  id: string;
  malId: number;
  title: {
    romaji: string;
    english: string;
    native: string;
    userPreferred: string;
  };
  image: string;
  imageHash: string;
  trailer: {
    id: string;
    site: string;
    thumbnail: string;
    thumbnailHash: string;
  };
  description: string;
  status: string;
  cover: string;
  coverHash: string;
  rating: number;
  releaseDate: number;
  color: string;
  genres: string[];
  totalEpisodes: number;
  duration: number;
  startDate: {
    year: number;
    day: number;
    month: any;
  };
  type: string;
}

export interface ConsumetAnimePage {
  currentPage: number;
  hasNextPage: boolean;
  results: ConsumetAnime[];
}

export interface ConsumetUpcomingAnimeList {
  currentPage: number;
  hasNextPage: boolean;
  results: UpcomingAnime[];
}

export interface UpcomingAnime {
  id: string;
  malId: number;
  episode: number;
  airingAt: number;
  title: {
    romaji: string;
    english: string;
    native: string;
    userPreferred: string;
  };
  country: string;
  image: string;
  imageHash: string;
  description: string;
  cover: string;
  coverHash: string;
  genres: string[];
  color: string;
  rating: number;
  releaseDate: number;
  type: string;
}

export interface ConsumetSearchResult {
  currentPage: number;
  hasNextPage: boolean;
  totalPages: number;
  totalResults: number;
  results: {
    id: string;
    malId: number;
    title: {
      english: string;
      native: string;
      romaji: string;
    };
    status: string;
    image: string;
    imageHash: string;
    cover: string;
    coverHash: string;
    popularity: number;
    totalEpisodes: number;
    currentEpisode: number | null;
    countryOfOrigin: string;
    description: string;
    genres: string[];
    rating: number;
    color: string;
    type: string;
    releaseDate: number;
  }[];
}

export interface ConsumetRecommendation {
  id: number;
  malId: number;
  title: {
    english: string;
    romaji: string;
    native: string;
  };
  status: string;
  episodes: number;
  image: string;
  imageHash: string;
  cover: string;
  coverHash: string;
  rating: number;
  type: string;
}

export interface ExtendedAnimePage extends ConsumetAnimePage {
  totalPages: number;
}
