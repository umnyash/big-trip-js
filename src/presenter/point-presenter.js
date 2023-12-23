import { render, replace, remove } from '../framework/render.js';
import { isEscapeEvent } from '../utils/common.js';
import PointFormView from '../view/point-form-view.js';
import PointCardView from '../view/point-card-view.js';

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

export default class PointPresenter {
  #listElement = null;
  #handleDataChange = null;
  #handleModeChange = null;

  #pointCardComponent = null;
  #pointFormComponent = null;

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

    const prevPointCardComponent = this.#pointCardComponent;
    const prevPointFormComponent = this.#pointFormComponent;

    this.#pointCardComponent = new PointCardView({
      point: this.#point,
      offers: getSelectedOffers(this.#offers, this.#point.type, this.#point.offers),
      destinationName: getDestinationName(this.#destinations, this.#point.destination),
      onFavoriteButtonClick: this.#handleFavoriteClick,
      onEditButtonClick: this.#handleEditButtonClick,
    });

    this.#pointFormComponent = new PointFormView({
      point: this.#point,
      offers: this.#offers,
      destinations: this.#destinations,
      onFormSubmit: this.#handleFormSubmit,
    });

    if (prevPointCardComponent === null || prevPointFormComponent === null) {
      render(this.#pointCardComponent, this.#listElement);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointCardComponent, prevPointCardComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#pointFormComponent, prevPointFormComponent);
    }

    remove(prevPointCardComponent);
    remove(prevPointFormComponent);
  }

  destroy() {
    remove(this.#pointCardComponent);
    remove(this.#pointFormComponent);
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#replaceFormToCard();
    }
  }

  #replaceCardToForm() {
    replace(this.#pointFormComponent, this.#pointCardComponent);
    document.addEventListener('keydown', this.#handleEscapeKeydown);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  }

  #replaceFormToCard() {
    replace(this.#pointCardComponent, this.#pointFormComponent);
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
