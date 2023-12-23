import { render, replace, remove } from '../framework/render.js';
import { isEscapeEvent } from '../utils/common.js';
import EventFormView from '../view/event-form-view.js';
import EventView from '../view/event-view.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

function getSelectedOffers(offers, type, selectedOffersIds) {
  const offersByCurrentType = offers.find((offersByType) => offersByType.type === type).offers;

  const selectedOffers = offersByCurrentType.filter((offer) => {
    for (const offerId of selectedOffersIds) {
      if (offer.id === offerId) {
        return true;
      }
    }
  });

  return selectedOffers;
}

function getDestinationName(destinations, id) {
  const destinationData = destinations.find((destination) => destination.id === id);
  const destinationName = destinationData.name;

  return destinationName;
}

export default class EventPresenter {
  #listElement = null;
  #handleDataChange = null;
  #handleModeChange = null;

  #eventComponent = null;
  #eventFormComponent = null;

  #point = null;
  #offers = [];
  #destinations = [];
  #mode = Mode.DEFAULT;

  constructor({ listElement, onDataChange, onModeChange }) {
    this.#listElement = listElement;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
  }

  init(point, offers, destinations) {
    this.#point = point;
    this.#offers = offers;
    this.#destinations = destinations;

    const prevEventComponent = this.#eventComponent;
    const prevEventFormComponent = this.#eventFormComponent;

    this.#eventComponent = new EventView({
      point: this.#point,
      offers: getSelectedOffers(this.#offers, this.#point.type, this.#point.offers),
      destinationName: getDestinationName(this.#destinations, this.#point.destination),
      onFavoriteButtonClick: this.#handleFavoriteClick,
      onEditButtonClick: this.#handleEditButtonClick,
    });

    this.#eventFormComponent = new EventFormView({
      point: this.#point,
      offers: this.#offers,
      destinations: this.#destinations,
      onFormSubmit: this.#handleFormSubmit,
    });

    if (prevEventComponent === null || prevEventFormComponent === null) {
      render(this.#eventComponent, this.#listElement);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#eventComponent, prevEventComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#eventFormComponent, prevEventFormComponent);
    }

    remove(prevEventComponent);
    remove(prevEventFormComponent);
  }

  destroy() {
    remove(this.#eventComponent);
    remove(this.#eventFormComponent);
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#replaceFormToCard();
    }
  }

  #replaceCardToForm() {
    replace(this.#eventFormComponent, this.#eventComponent);
    document.addEventListener('keydown', this.#handleEscapeKeydown);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  }

  #replaceFormToCard() {
    replace(this.#eventComponent, this.#eventFormComponent);
    document.removeEventListener('keydown', this.#handleEscapeKeydown);
    this.#mode = Mode.DEFAULT;
  }

  #handleEscapeKeydown = (evt) => {
    if (isEscapeEvent(evt)) {
      evt.preventDefault();
      this.#replaceFormToCard();
    }
  };

  #handleFavoriteClick = () => {
    this.#handleDataChange({ ...this.#point, isFavorite: !this.#point.isFavorite });
  };

  #handleEditButtonClick = () => {
    this.#replaceCardToForm();
  };

  #handleFormSubmit = () => {
    this.#replaceFormToCard();
  };
}
