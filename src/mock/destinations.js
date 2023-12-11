import {
  DESTINATION_NAMES,
  DESTINATION_PHOTOS,
  TEXTS,
  DestinationPhotosCount,
  DestinationDescriptionSentencesCount,
} from './const.js';

import { getRandomInteger, getRandomArrayItem } from './utils.js';

export default function generateDestinations() {
  const destinations = DESTINATION_NAMES.map((name, index) => {
    const picturesCount = getRandomInteger(DestinationPhotosCount.MIN, DestinationPhotosCount.MAX);
    const pictures = Array.from({ length: picturesCount}, () => getRandomArrayItem(DESTINATION_PHOTOS));

    const descriptionSentencesCount = getRandomInteger(DestinationDescriptionSentencesCount.MIN, DestinationDescriptionSentencesCount.MAX);
    const description = Array.from({ length: descriptionSentencesCount }, () => getRandomArrayItem(TEXTS)).join(' ');

    return {
      id: index,
      name,
      pictures,
      description,
    };
  });

  return destinations;
}
