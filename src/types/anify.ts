export interface Title {
  native: string;
  romaji: string;
  english: string;
}

export interface Mapping {
  id: string;
  providerId: string;
  similarity: number;
  providerType: string;
}

export interface Rating {
  mal: number;
  tmdb: number;
  anilist: number;
}

export interface Popularity {
  mal: number;
  tmdb: number;
  anilist: number;
}

export interface Episode {
  id: string;
  img: string | null;
  title: string;
  hasDub: boolean;
  number: number;
  rating: any; // Assuming rating can be of any type
  isFiller: boolean;
  updatedAt: number;
  description: string | null;
}

export interface EpisodesData {
  episodes: Episode[];
  providerId: string;
}

export interface LatestEpisode {
  updatedAt: number;
  latestTitle: string;
  latestEpisode: number;
}

export interface Artwork {
  img: string;
  type: string;
  providerId: string;
}

export interface VoiceActor {
  name: string;
  image: string;
}

export interface Character {
  name: string;
  image: string;
  voiceActor: VoiceActor;
}

export interface AnimeData {
  id: string;
  slug: string;
  coverImage: string;
  bannerImage: string;
  trailer: string;
  status: string;
  season: string;
  title: Title;
  currentEpisode: number;
  mappings: Mapping[];
  synonyms: string[];
  countryOfOrigin: string;
  description: string;
  duration: number;
  color: string;
  year: number;
  rating: Rating;
  popularity: Popularity;
  type: string;
  format: string;
  relations:
    | Mapping[]
    | {
        id: number;
        relationType: string;
        malId: number;
        title: {
          romaji: string;
          english: string;
          native: string;
          userPreferred: string;
        };
        status: string;
        episodes: number | null;
        image: string;
        imageHash: string;
        color: string | null;
        type: string;
        cover: string;
        coverHash: string;
        rating: number | null;
      }[];
  totalEpisodes: number;
  genres: string[];
  tags: string[];
  episodes: {
    data: EpisodesData[];
    latest: LatestEpisode;
  };
  averageRating: number;
  averagePopularity: number;
  artwork: Artwork[];
  characters: Character[];
}
