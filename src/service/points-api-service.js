import ApiService from '../framework/api-service.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

export default class PointsApiService extends ApiService {
  get points() {
    return this._load({ url: 'points' })
      .then(ApiService.parseResponse);
  }

  get offers() {
    return this._load({ url: 'offers'})
      .then(ApiService.parseResponse);
  }

  get destinations() {
    return this._load({ url: 'destinations'})
      .then(ApiService.parseResponse);
  }

  async addPoint(point) {
    const response = await this._load({
      url: 'points',
      method: Method.POST,
      body: JSON.stringify(this.#adaptPointToServer(point)),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  async updatePoint(point) {
    const response = await this._load({
      url: `points/${point.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptPointToServer(point)),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  async deletePoint(point) {
    const response = await this._load({
      url: `points/${point.id}`,
      method: Method.DELETE,
    });

    return response;
  }

  #adaptPointToServer(point) {
    const adaptedPoint = {
      ...point,
      'base_price': point.basePrice,
      'is_favorite': point.isFavorite,
      'date_to': point.dateTo.toISOString(),
      'date_from': point.dateFrom.toISOString(),
    };

    delete adaptedPoint.basePrice;
    delete adaptedPoint.isFavorite;
    delete adaptedPoint.dateFrom;
    delete adaptedPoint.dateTo;

    return adaptedPoint;
  }
}
