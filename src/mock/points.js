import { POINTS_TYPES } from '../const.js';
import { pointBasePrice } from './const.js';
import generateDestinations from './destinations.js';
import generateOffers from './offers.js';
import generateDates from './dates.js';
import { getRandomInteger, getRandomArrayItem, createUniqueRandomIntegerGenerator } from './utils.js';

const destinations = generateDestinations();
const allOffers = generateOffers();

function getRandomSelectedOffersIds(type) {
  const offers = allOffers.find((offersByType) => offersByType.type === type).offers;
  const selectedOffersCount = getRandomInteger(0, offers.length);
  const getOfferId = createUniqueRandomIntegerGenerator(0, offers.length - 1);

  return Array.from({ length: selectedOffersCount }, getOfferId);
}

export function getDestinations() {
  return destinations;
}

export function getOffers() {
  return allOffers;
}

export function generatePoints(count) {
  const dates = generateDates(count);

  const points = Array.from({ length: count }, (_item, index) => {
    const type = getRandomArrayItem(POINTS_TYPES);
    const offers = getRandomSelectedOffersIds(type);

    return {
      basePrice: getRandomInteger(pointBasePrice.MIN, pointBasePrice.MAX),
      dateFrom: dates[index].from,
      dateTo: dates[index].to,
      destination: getRandomInteger(0, destinations.length - 1),
      id: index,
      isFavorite: Boolean(getRandomInteger(0, 1)),
      offers,
      type,
    };
  });

  return points;
}
