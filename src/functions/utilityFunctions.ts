export function capitalizeFirstLetter(input: string): string {
  const lowercaseInput = input.toLowerCase();

  const capitalizedFirstLetter =
    lowercaseInput.charAt(0).toUpperCase() + lowercaseInput.slice(1);

  return capitalizedFirstLetter;
}

export interface EpisodeConsumet {
  id: string;
  title: string;
  image: string;
  imageHash: string;
  number: number;
  createdAt: string;
  description: string | null;
  url: string;
}

export interface IEpisode {
  id: string;
  img: string | null;
  title: string;
  hasDub: boolean;
  number: number;
  isFiller: boolean;
  updatedAt: number;
  description: string | null;
}

export function convertToEpisode(episode: EpisodeConsumet): IEpisode {
  return {
    id: `/${episode.id}`,
    img: episode.image || null,
    title: episode.title,
    hasDub: false,
    number: episode.number,
    isFiller: false,
    updatedAt: parseInt(episode.createdAt),
    description: episode.description || null,
  };
}

/**
 * getCurrentSeason function returns the current season based on the current month.
 * The seasons are determined based on the following months:
 * - Spring: March, April, May
 * - Summer: June, July, August
 * - Fall: September, October, November
 * - Winter: December, January, February
 * @returns The current season as a string: 'SPRING', 'SUMMER', 'FALL', or 'WINTER'.
 */
export function getCurrentSeason(): 'SPRING' | 'SUMMER' | 'FALL' | 'WINTER' {
  // Get the current month
  const month = new Date().getMonth() + 1; // Adding 1 to get 1-indexed month

  // Determine the season based on the month
  switch (true) {
    case month >= 3 && month <= 5:
      return 'SPRING';
    case month >= 6 && month <= 8:
      return 'SUMMER';
    case month >= 9 && month <= 11:
      return 'FALL';
    default:
      return 'WINTER';
  }
}

/**
 * getRandom function returns a randomly selected element from a given list of values.
 * @param values - A list of values from which a random element will be selected.
 * @returns A randomly selected element from the list of values, or undefined if the list is empty.
 */
export function getRandom<T>(...values: T[]): T | undefined {
  // Check if the list of values is empty
  if (values.length === 0) return undefined;

  // Generate a random index within the range of the list's length
  const randomIndex = Math.floor(Math.random() * values.length);

  // Return the element at the randomly generated index
  return values[randomIndex];
}

export function numberToMonth(num: number): string {
  // Use a switch statement to match the input number to the corresponding month
  switch (num) {
    case 1:
      return 'January';
    case 2:
      return 'February';
    case 3:
      return 'March';
    case 4:
      return 'April';
    case 5:
      return 'May';
    case 6:
      return 'June';
    case 7:
      return 'July';
    case 8:
      return 'August';
    case 9:
      return 'September';
    case 10:
      return 'October';
    case 11:
      return 'November';
    case 12:
      return 'December';
    default:
      return 'January';
  }
}
