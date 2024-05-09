import type { AnimeData } from './anify';
import type { ConsumetRecommendation } from './consumet';

export interface AnimeInfo extends AnimeData {
  recommendations: ConsumetRecommendation[];
  studios: string[];
  startDate: StartDate;
  malId: string;
  studiosInfo: {
    id: string;
    name: string;
  }[];
}

export interface PageInfo {
  total: number;
  perPage: number;
  currentPage: number;
  lastPage: number;
  hasNextPage: boolean;
}

export interface Title {
  native: string;
  romaji: string;
  english: string;
  userPreferred: string;
}

export interface CoverImage {
  large: string;
  extraLarge: string;
  color: string;
}

export interface NextAiringEpisode {
  airingAt: number;
  episode: number;
}

export interface StartDate {
  year: number;
  month: number;
  day: number;
}

export interface EndDate {
  year: number;
  month: number;
  day: number;
}

export interface Media {
  id: number;
  idMal: number;
  title: Title;
  coverImage: CoverImage;
  bannerImage: string;
  episodes: number;
  status: string;
  duration: number;
  genres: string[];
  season: string;
  color: string;
  format: string;
  averageScore: number;
  popularity: number;
  nextAiringEpisode: NextAiringEpisode | null;
  seasonYear: number;
  startDate: StartDate;
  endDate: EndDate;
}

export interface Character {
  id: number;
  name: {
    full: string;
    native: string;
  };
  image: {
    large: string;
    medium: string;
  };
  role: string;
}

export interface Staff {
  id: number;
  name: {
    full: string;
    native: string;
  };
  language: string;
  image: {
    large: string;
    medium: string;
  };
  role: string;
}

export interface MediaWithCharactersAndStaff extends Media {
  characters: {
    edges: {
      node: Character;
      role: string;
    }[];
  };
  staff: {
    edges: {
      node: Staff;
      role: string;
    }[];
  };
}

export interface Top100Response {
  pagination: PageInfo;
  results: MediaWithCharactersAndStaff[];
}

export interface VoiceActor {
  name: string;
  image: string;
}

export interface ICharacter {
  name: string;
  image: string;
  voiceActor: VoiceActor;
}

export interface CharacterRes {
  id: string;
  title: {
    english: string;
    romaji: string;
    native: string;
  };
  characters: ICharacter[];
}

export interface SiteEpisode {
  id: string;
  img: string;
  title: string;
  description: string;
  number: number;
}

export interface SiteAnime {
  episodes: SiteEpisode[];
  providerId: string;
}

