import { render, replace, remove } from '../framework/render.js';
import { isEscapeEvent } from '../utils/common.js';
import { isDatesEqual } from '../utils/point.js';
import PointFormView from '../view/point-form-view.js';
import PointCardView from '../view/point-card-view.js';
import { UserAction, UpdateType } from '../const.js';

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
      onFormReset: this.#handleFormReset,
      onFormSubmit: this.#handleFormSubmit,
      onDeleteButtonClick: this.#handleDeleteClick,
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
      this.#pointFormComponent.reset(this.#point);
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
      this.#pointFormComponent.reset(this.#point);
      this.#replaceFormToCard();
    }
  };

  #handleFavoriteClick = () => {
    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      { ...this.#point, isFavorite: !this.#point.isFavorite },
    );
  };

  #handleDeleteClick = (point) => {
    this.#handleDataChange(
      UserAction.DELETE_POINT,
      UpdateType.MAJOR,
      point,
    );
  };

  #handleEditButtonClick = () => {
    this.#replaceCardToForm();
  };

  #handleFormReset = () => {
    this.#pointFormComponent.reset(this.#point);
    this.#replaceFormToCard();
  };

  #handleFormSubmit = (point) => {
    const isMinorUpdate =
      !isDatesEqual(this.#point.dateFrom, point.dateFrom) ||
      !isDatesEqual(this.#point.dateTo, point.dateTo) ||
      this.#point.basePrice !== point.basePrice;

    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
      point,
    );
    this.#replaceFormToCard();
  };
}
