import AbstractView from '../framework/view/abstract-view.js';
import { humanizeDate, getDestinationName, getSelectedOffers } from '../utils/point.js';
import { POINT_DATE_FORMAT } from '../const.js';
import dayjs from 'dayjs';

function createHeadingTemplate(points, destinations) {
  let headingText = '';

  switch (true) {
    case points.length > 0 && points.length <= 3:
      headingText = points
        .map((point) => getDestinationName(destinations, point.destination))
        .join(' &mdash; ');
      break;
    case points.length > 3:
      headingText = [
        getDestinationName(destinations, points[0].destination),
        '...',
        getDestinationName(destinations, points[points.length - 1].destination)
      ].join(' &mdash; ');
      break;
  }

  return (`
    <h1 class="trip-info__title">
      ${headingText}
    </h1>
  `);
}

function createDatesTemplate(points) {
  let datesText = '';

  if (points.length) {
    const firstPointDateFrom = points[0].dateFrom;
    const lastPointDateTo = points[points.length - 1].dateTo;

    const dateFrom = humanizeDate(firstPointDateFrom, POINT_DATE_FORMAT);

    const isDatesInSameMonth = (dateA, dateB) => {
      const dateAYear = dayjs(dateA).year();
      const dateBYear = dayjs(dateB).year();

      if (dateAYear !== dateBYear) {
        return false;
      }

      const dateAMonth = dayjs(dateA).month();
      const dateBMonth = dayjs(dateB).month();

      return dateAMonth === dateBMonth;
    };

    const dateTo = isDatesInSameMonth(firstPointDateFrom, lastPointDateTo)
      ? dayjs(lastPointDateTo).date()
      : humanizeDate(lastPointDateTo, POINT_DATE_FORMAT);

    datesText = `${dateFrom}&nbsp;&mdash;&nbsp;${dateTo}`;
  }

  return (`
    <p class="trip-info__dates">
      ${datesText}
    </p>
  `);
}

function createCostTemplate(points, offers) {
  const cost = points.reduce((acc, point) => {
    const selectedOffers = getSelectedOffers(offers, point.type, point.offers);

    const offersCost = selectedOffers.reduce((acc2, offer) => acc2 + offer.price, 0);

    return acc + point.basePrice + offersCost;
  }, 0);

  return(`
    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${cost}</span>
    </p>
  `);
}

function createTripInfoTemplate(points, destinations, offers) {
  const headingTemplate = createHeadingTemplate(points, destinations);
  const datesTemplate = createDatesTemplate(points);
  const costTemplate = createCostTemplate(points, offers);

  return (`
    <section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        ${headingTemplate}
        ${datesTemplate}
      </div>
      ${costTemplate}
    </section>
  `);
}

export default class TripInfoView extends AbstractView {
  #points = null;
  #destinations = null;
  #offers = null;

  constructor({ points, destinations, offers }) {
    super();
    this.#points = points;
    this.#destinations = destinations;
    this.#offers = offers;
  }

  get template() {
    return createTripInfoTemplate(this.#points, this.#destinations, this.#offers);
  }
}
