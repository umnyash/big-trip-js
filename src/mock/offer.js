import { OfferPrice } from './const.js';
import { getRandomInteger } from './utils.js';

export default function generateOffer(type, id) {
  return {
    id,
    title: `${type}-offer-${id}`,
    price: getRandomInteger(OfferPrice.MIN, OfferPrice.MAX),
  };
}
