import { POINTS_TYPES } from '../const.js';
import { convertFirstCharacterToUpperCase } from '../utils/point.js';
import AbstractView from '../framework/view/abstract-view.js';

function createTypeListTemplate(types, selectedType) {
  return (`
    <div class="event__type-list">
      <fieldset class="event__type-group">
        ${types.map((type) => `
          <div class="event__type-item">
            <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value=${type} ${type === selectedType ? 'checked' : ''}>
            <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${convertFirstCharacterToUpperCase(type)}</label>
          </div>
        `).join('')}
      </fieldset>
    </div>
  `);
}

function createOffersTemplate(type, offers, selectedOffersIds) {
  const offersByCurrentType = offers.find((offersByType) => offersByType.type === type).offers;

  if (!offersByCurrentType.length) {
    return '';
  }

  return (`
    <section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
        ${offersByCurrentType.map(({ id, title, price }) => `
          <div class="event__offer-selector">
            <input class="event__offer-checkbox  visually-hidden" id="event-offer-${title}-1" type="checkbox" name="event-offer-${title}" ${selectedOffersIds.includes(id) ? 'checked' : ''}>
            <label class="event__offer-label" for="event-offer-${title}-1">
              <span class="event__offer-title">Add ${title}</span>
              &plus;&euro;&nbsp;
              <span class="event__offer-price">${price}</span>
            </label>
          </div>
        `).join('')}
      </div>
    </section>
  `);
}

function getDestination(destinationId, destinations) {
  return destinations.find((destinationData) => destinationData.id === destinationId);
}

function createDestinationTemplate(destinationId, destinations) {
  const destination = getDestination(destinationId, destinations);

  if (!destination.description && !destination.pictures.length) {
    return '';
  }

  return (`
    <section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${destination.description}</p>

      <div class="event__photos-container">
        <div class="event__photos-tape">
          ${destination.pictures.map((picture) => `
            <img class="event__photo" src=${picture.src} alt="Event photo">
          `).join('')}
        </div>
      </div>
    </section>
  `);
}

function createDestinationsValuesList(destinations) {
  return (`
    <datalist id="destination-list-1">
      ${destinations.map((destination) => `
        <option value=${destination.name}></option>
      `).join('')}
    </datalist>
  `);
}

function createPointDetailsTemplate(offersTemplate, destinationTemplate) {
  if (!offersTemplate && !destinationTemplate) {
    return '';
  }

  return (
    `<section class="event__details">
      ${offersTemplate}
      ${destinationTemplate}
    </section>`
  );
}

function createPointFormTemplate(point = {}, offers, destinations) {
  const {
    basePrice = '',
    type = 'taxi',
    offers: offersIds = [],
    destination: destinationId = '',
  } = point;

  const typeListTemplate = createTypeListTemplate(POINTS_TYPES, type);
  const offersTemplate = createOffersTemplate(type, offers, offersIds);
  const destinationValuesList = createDestinationsValuesList(destinations);
  const destinationName = (destinationId === '') ? '' : getDestination(destinationId, destinations).name;
  const destinationTemplate = (destinationId === '') ? '' : createDestinationTemplate(destinationId, destinations);
  const pointDetailsTemplate = createPointDetailsTemplate(offersTemplate, destinationTemplate);

  return (`
    <li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
            ${typeListTemplate}
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${convertFirstCharacterToUpperCase(type)}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value=${destinationName} list="destination-list-1">
            ${destinationValuesList}
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="19/03/19 00:00">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="19/03/19 00:00">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value=${basePrice}>
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Cancel</button>
        </header>
        ${pointDetailsTemplate}
      </form>
    </li>
  `);
}

export default class PointFormView extends AbstractView {
  #point = null;
  #offers = null;
  #destinations = null;
  #handleFormSubmit = null;

  constructor({ point, offers, destinations, onFormSubmit }) {
    super();

    this.#point = point;
    this.#offers = offers;
    this.#destinations = destinations;
    this.#handleFormSubmit = onFormSubmit;

    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
  }

  get template() {
    return createPointFormTemplate(this.#point, this.#offers, this.#destinations);
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit();
  };
}
