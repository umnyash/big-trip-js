import { render, replace, remove } from '../framework/render.js';
import { isEscapeEvent } from '../utils/common.js';
import { isDatesEqual, getDestinationName, getSelectedOffers, isOffersSame } from '../utils/point.js';
import PointFormView from '../view/point-form-view.js';
import PointCardView from '../view/point-card-view.js';
import { UserAction, UpdateType } from '../const.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

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
      replace(this.#pointCardComponent, prevPointFormComponent);
      this.#mode = Mode.DEFAULT;
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

  setSaving() {
    if (this.#mode === Mode.EDITING) {
      this.#pointFormComponent.updateElement({
        isDisabled: true,
        isSaving: true,
      });
    }
  }

  setDeleting() {
    if (this.#mode === Mode.EDITING) {
      this.#pointFormComponent.updateElement({
        isDisabled: true,
        isDeleting: true,
      });
    }
  }

  setAborting() {
    if (this.#mode === Mode.DEFAULT) {
      this.#pointCardComponent.shake();
      return;
    }

    const resetFormState = () => {
      this.#pointFormComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#pointFormComponent.shake(resetFormState);
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
      this.#point.basePrice !== point.basePrice ||
      !isOffersSame(this.#point.offers, point.offers);

    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
      point,
    );
  };
}
