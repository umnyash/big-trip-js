import AbstractView from '../framework/view/abstract-view.js';
import { humanizeDate, getHumanizedDuration } from '../utils/event.js';
import { POINT_DATE_FORMAT, POINT_TIME_FORMAT } from '../const.js';

function createOffersListTemplate(offers) {
  return (`
    <ul class="event__selected-offers">
      ${offers.map(({ title, price }) => `
        <li class="event__offer">
          <span class="event__offer-title">${title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${price}</span>
        </li>
      `).join('')}
    </ul>
  `);
}

function createEventTemplate(name, point, offers) {
  const { basePrice, dateFrom, dateTo, type, isFavorite } = point;

  const humanizedDateFrom = humanizeDate(dateFrom, POINT_DATE_FORMAT);
  const humanizedTimeFrom = humanizeDate(dateFrom, POINT_TIME_FORMAT);
  const humanizedTimeTo = humanizeDate(dateTo, POINT_TIME_FORMAT);
  const humanizedDuration = getHumanizedDuration(dateFrom, dateTo);
  const offersListTemplate = createOffersListTemplate(offers);
  const favoriteButtonActiveClassName = (isFavorite) ? 'event__favorite-btn--active' : '';

  return (`
    <li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime=${dateFrom}>${humanizedDateFrom}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${type} ${name}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime=${dateFrom}>${humanizedTimeFrom}</time>
            &mdash;
            <time class="event__end-time" datetime=${dateTo}>${humanizedTimeTo}</time>
          </p>
          <p class="event__duration">${humanizedDuration}</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        ${offersListTemplate}
        <button class="event__favorite-btn ${favoriteButtonActiveClassName}" type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>
  `);
}

export default class EventView extends AbstractView {
  #name = null;
  #point = null;
  #offers = null;
  #handleEditButtonClick = null;

  constructor({ name, point, offers, onEditButtonClick }) {
    super();

    this.#name = name;
    this.#point = point;
    this.#offers = offers;
    this.#handleEditButtonClick = onEditButtonClick;

    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#editButtonClickHundler);
  }

  get template() {
    return createEventTemplate(this.#name, this.#point, this.#offers);
  }

  #editButtonClickHundler = (evt) => {
    evt.preventDefault();
    this.#handleEditButtonClick();
  };
}
