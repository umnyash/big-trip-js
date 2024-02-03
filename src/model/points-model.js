import Observable from '../framework/observable.js';
import { UpdateType } from '../const.js';

export default class PointsModel extends Observable {
  #pointsApiServise = null;
  #points = [];
  #offers = [];
  #destinations = [];

  constructor({ pointsApiService }) {
    super();
    this.#pointsApiServise = pointsApiService;
  }

  get destinations() {
    return this.#destinations;
  }

  get offers() {
    return this.#offers;
  }

  get points() {
    return this.#points;
  }

  async init() {
    try {
      const [points, offers, destinations] = await Promise.all([
        this.#pointsApiServise.points,
        this.#pointsApiServise.offers,
        this.#pointsApiServise.destinations,
      ]);

      this.#points = points.map(this.#adaptPointToClient);
      this.#offers = offers;
      this.#destinations = destinations;
    } catch (err) {
      this.#points = [];
      this.#offers = [];
      this.#destinations = [];
    }

    this._notify(UpdateType.INIT);
  }

  async addPoint(updateType, update) {
    try {
      const response = await this.#pointsApiServise.addPoint(update);
      const newPoint = this.#adaptPointToClient(response);
      this.#points = [newPoint, ...this.#points];
      this._notify(updateType, newPoint);
    } catch (err) {
      throw new Error('Can\'t add task');
    }
  }

  async deletePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }

    try {
      await this.#pointsApiServise.deletePoint(update);

      this.#points = [
        ...this.#points.slice(0, index),
        ...this.#points.slice(index + 1),
      ];

      this._notify(updateType, update);
    } catch (err) {
      throw new Error('Can\'t delete point');
    }
  }

  async updatePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    try {
      const response = await this.#pointsApiServise.updatePoint(update);
      const updatedPoint = this.#adaptPointToClient(response);

      this.#points = [
        ...this.#points.slice(0, index),
        updatedPoint,
        ...this.#points.slice(index + 1),
      ];

      this._notify(updateType, updatedPoint);
    } catch (err) {
      throw new Error('Can\'t update task');
    }
  }

  #adaptPointToClient(point) {
    const adaptedPoint = {
      ...point,
      basePrice: point['base_price'],
      isFavorite: point['is_favorite'],
      dateFrom: new Date(point['date_from']),
      dateTo: new Date(point['date_to']),
    };

    delete adaptedPoint['base_price'];
    delete adaptedPoint['date_from'];
    delete adaptedPoint['date_to'];
    delete adaptedPoint['is_favorite'];

    return adaptedPoint;
  }
}
