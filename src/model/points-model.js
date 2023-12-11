import { POINTS_COUNT } from '../mock/const.js';
import { getDestinations, getOffers, generatePoints } from '../mock/points.js';

export default class PointsModel {
  points = generatePoints(POINTS_COUNT);
  offers = getOffers();
  destinations = getDestinations();

  getDestinations() {
    return this.destinations;
  }

  getOffers() {
    return this.offers;
  }

  getPoints() {
    return this.points;
  }
}
