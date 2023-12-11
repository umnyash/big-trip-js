import { POINTS_COUNT } from '../mock/const.js';
import { getDestinations, getOffers, generatePoints } from '../mock/points.js';

export default class PointsModel {
  #points = generatePoints(POINTS_COUNT);
  #offers = getOffers();
  #destinations = getDestinations();

  get destinations() {
    return this.#destinations;
  }

  get offers() {
    return this.#offers;
  }

  get points() {
    return this.#points;
  }
}
