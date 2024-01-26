import { POINTS_TYPES } from '../const.js';
import { convertFirstCharacterToUpperCase, getDateNow } from '../utils/point.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import he from 'he';

const BLANK_POINT = {
  basePrice: '',
  dateFrom: getDateNow(),
  dateTo: getDateNow(),
  type: 'taxi',
  offers: [],
  destination: null,
};

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
            <input
              class="event__offer-checkbox visually-hidden"
              id="event-offer-${title}-1"
              type="checkbox"
              name="event-offer-${title}"
              data-id=${id}
              ${selectedOffersIds[id] ? 'checked' : ''}
            >
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
  return destinations.find((destination) => destination.id === destinationId);
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

function createPointButtonsTemplate(isNewPoint) {
  if (isNewPoint) {
    return(`
      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">Cancel</button>
    `);
  } else {
    return(`
      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="button">Delete</button>
      <button class="event__rollup-btn" type="reset">
        <span class="visually-hidden">Open event</span>
      </button>
    `);
  }
}

function createPointFormTemplate(data, isNew, offers, destinations) {
  const {
    basePrice,
    type,
    offers: offersIds,
    destination: destinationId,
  } = data;

  const typeListTemplate = createTypeListTemplate(POINTS_TYPES, type);
  const offersTemplate = createOffersTemplate(type, offers, offersIds);
  const destinationValuesList = createDestinationsValuesList(destinations);
  const destinationName = (destinationId === null) ? '' : getDestination(destinationId, destinations).name;
  const destinationTemplate = (destinationId === null) ? '' : createDestinationTemplate(destinationId, destinations);
  const pointDetailsTemplate = createPointDetailsTemplate(offersTemplate, destinationTemplate);
  const pointButtonsTemplate = createPointButtonsTemplate(isNew);

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
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" required name="event-destination" value="${he.encode(destinationName)}" list="destination-list-1">
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
            <input class="event__input  event__input--price" id="event-price-1" type="number" min="0" name="event-price" required value=${basePrice}>
          </div>
          ${pointButtonsTemplate}
        </header>
        ${pointDetailsTemplate}
      </form>
    </li>
  `);
}

export default class PointFormView extends AbstractStatefulView {
  #offers = null;
  #destinations = null;
  #handleFormReset = null;
  #handleFormSubmit = null;
  #handleDeleteButtonClick = null;
  #datepickerFrom = null;
  #datepickerTo = null;
  #isNewPoint = false;

  constructor({ point = BLANK_POINT, isNewPoint, offers, destinations, onFormReset, onFormSubmit, onDeleteButtonClick }) {
    super();

    this._setState(PointFormView.parsePointToState(point));
    this.#offers = offers;
    this.#destinations = destinations;
    this.#handleFormReset = onFormReset;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleDeleteButtonClick = onDeleteButtonClick;
    this.#isNewPoint = isNewPoint;

    this._restoreHandlers();
  }

  removeElement() {
    super.removeElement();

    if (this.#datepickerFrom) {
      this.#datepickerFrom.destroy();
      this.#datepickerFrom = null;
    }

    if (this.#datepickerTo) {
      this.#datepickerTo.destroy();
      this.#datepickerTo = null;
    }
  }

  get template() {
    return createPointFormTemplate(this._state, this.#isNewPoint, this.#offers, this.#destinations);
  }

  reset(point) {
    this.updateElement(PointFormView.parsePointToState(point));
  }

  _restoreHandlers = () => {
    this.element.querySelector('form').addEventListener('reset', this.#formResetHandler);
    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event__reset-btn[type="button"]')?.addEventListener('click', this.#deleteButtonClickHandler);
    this.element.querySelector('.event__type-group').addEventListener('change', this.#eventTypeChangeHandler);
    this.element.querySelector('.event__available-offers')?.addEventListener('change', this.#eventOffersChangeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('input', this.#eventDestinationInputHandler);
    this.element.querySelector('.event__input--price').addEventListener('input', this.#basePriceInputHandler);
    this.#setDatepickers();
  };

  #formResetHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormReset();
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(PointFormView.parseStateToPoint(this._state));
  };

  #deleteButtonClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleDeleteButtonClick(PointFormView.parseStateToPoint(this._state));
  };

  #eventTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      type: evt.target.value,
      offers: {},
    });
  };

  #eventOffersChangeHandler = (evt) => {
    evt.preventDefault();

    const id = evt.target.dataset.id;
    const isChecked = evt.target.checked;

    this._setState({
      offers: { ...this._state.offers, [id]: isChecked },
    });
  };

  #eventDestinationInputHandler = (evt) => {
    evt.preventDefault();
    const currentDestination = this.#destinations.find((destination) => destination.name === evt.target.value);

    if (!currentDestination) {
      evt.target.setCustomValidity('This destination is not supported.');
      return;
    }

    evt.target.setCustomValidity('');

    this.updateElement({
      destination: currentDestination.id,
    });
  };

  #basePriceInputHandler = (evt) => {
    evt.preventDefault();
    this._setState({
      basePrice: +evt.target.value,
    });
  };

  #dateFromChangeHadler = ([userDate]) => {
    this._setState({
      dateFrom: userDate,
    });

    this.#datepickerTo.set('minDate', this._state.dateFrom);
  };

  #dateToChangeHadler = ([userDate]) => {
    this._setState({
      dateTo: userDate,
    });
  };

  #setDatepickers() {
    this.#datepickerFrom = flatpickr(
      this.element.querySelector('[name="event-start-time"]'),
      {
        dateFormat: 'd/m/y H:i',
        enableTime: true,
        'time_24hr': true,
        minuteIncrement: 1,
        defaultDate: this._state.dateFrom,
        onChange: this.#dateFromChangeHadler,
      }
    );

    this.#datepickerTo = flatpickr(
      this.element.querySelector('[name="event-end-time"]'),
      {
        dateFormat: 'd/m/y H:i',
        enableTime: true,
        'time_24hr': true,
        minuteIncrement: 1,
        defaultDate: this._state.dateTo,
        onChange: this.#dateToChangeHadler,
        minDate: this._state.dateFrom,
      }
    );
  }

  static parsePointToState(point) {
    const offersList = {};

    point.offers.forEach((id) => {
      offersList[id] = true;
    });

    return {
      ...point,
      offers: offersList,
    };
  }

  static parseStateToPoint(state) {
    const offersIds = [];

    for (const id in state.offers) {
      if (state.offers[id]) {
        offersIds.push(+id);
      }
    }

    return {
      ...state,
      offers: offersIds,
    };
  }
}
