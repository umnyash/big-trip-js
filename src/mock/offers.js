import { POINTS_TYPES } from '../const.js';
import { OffersCount } from './const.js';
import generateOffer from './offer.js';
import { getRandomInteger } from './utils.js';

export default function generateOffers() {
  const offers = POINTS_TYPES.map((type) => {
    const offersCount = getRandomInteger(OffersCount.MIN, OffersCount.MAX);
    const offersList = Array.from({ length: offersCount }, (_item, index) => generateOffer(type, index));

    return {
      type,
      offers: offersList,
    };
  });

  return offers;
}
