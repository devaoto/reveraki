/**
 * GenerateColoredElementByStatus function generates a colored HTML element based on the provided status.
 * The color of the element is determined based on the status as follows:
 * - 'Ongoing' or 'RELEASING': Blue color (#00ccff)
 * - 'Completed' or 'FINISHED': Green color (#50C878)
 * - 'Not yet aired' or 'NOT_YET_RELEASED': Gold color (#FFD700)
 * - 'CANCELLED': Red color (#DC143C)
 * - Any other status: Default dark green color (#326d6c)
 * @param {Object} props - An object containing the status string.
 * @param {string} props.status - The status string used to determine the color.
 * @returns A span element with the provided status text and color determined by the status.
 */
export const GenerateColoredElementByStatus = ({
  status,
}: {
  status: string;
}) => {
  // Default color
  let sts = '#50C878';

  // Determine color based on status
  switch (status) {
    case 'Ongoing':
    case 'RELEASING':
      sts = '#00ccff';
      break;
    case 'Completed':
    case 'FINISHED':
      sts = '#50C878';
      break;
    case 'Not yet aired':
    case 'NOT_YET_RELEASED':
      sts = '#FFD700';
      break;
    case 'CANCELLED':
      sts = '#DC143C';
      break;
    default:
      sts = '#326d6c';
      break;
  }

  // Return a span element with the status text and color
  return <span style={{ color: sts }}>{status}</span>;
};

/**
 * GenerateColoredElementBySeason function generates a colored HTML element based on the provided season.
 * The color of the element is determined based on the season as follows:
 * - 'Fall': Brown color (#8B4513)
 * - 'Winter': Steel Blue color (#4682B4)
 * - 'Summer': Gold color (#FFD700)
 * - 'Spring': Lawn Green color (#7FFF00)
 * - Any other season: Default Steel Blue color (#4682B4)
 * @param {Object} props - An object containing the season string.
 * @param {string} props.season - The season string used to determine the color.
 * @returns A span element with the provided season text and color determined by the season.
 */
export const GenerateColoredElementBySeason = ({
  season,
}: {
  season: string;
}) => {
  // Default color
  let sts = '#50C878';

  // Determine color based on season
  switch (season.toLowerCase()) {
    case 'fall':
      sts = '#8B4513';
      break;
    case 'winter':
      sts = '#4682B4';
      break;
    case 'summer':
      sts = '#FFD700';
      break;
    case 'spring':
      sts = '#7FFF00';
      break;
    default:
      sts = '#4682B4';
      break;
  }

  // Return a span element with the season text and color
  return <span style={{ color: sts }}>{season}</span>;
};
