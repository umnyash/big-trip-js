import { RenderPosition, render, remove } from '../framework/render.js';
import { isEscapeEvent } from '../utils/common.js';
import PointFormView from '../view/point-form-view.js';
import { UserAction, UpdateType } from '../const.js';

export default class NewPointPresenter {
  #listElement = null;
  #handleDataChange = null;
  #handleDestroy = null;

  #pointFormComponent = null;

  #offers = [];
  #destinations = [];

  constructor({ listElement, onDataChange, onDestroy }) {
    this.#listElement = listElement;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
  }

  init(offers, destinations) {
    if (this.#pointFormComponent !== null) {
      return;
    }

    this.#offers = offers;
    this.#destinations = destinations;

    this.#pointFormComponent = new PointFormView({
      offers: this.#offers,
      destinations: this.#destinations,
      onFormReset: this.#handleFormReset,
      onFormSubmit: this.#handleFormSubmit,
      isNewPoint: true,
    });

    render(this.#pointFormComponent, this.#listElement, RenderPosition.AFTERBEGIN);
    document.addEventListener('keydown', this.#handleEscapeKeydown);
  }

  destroy() {
    if (this.#pointFormComponent === null) {
      return;
    }

    this.#handleDestroy();

    remove(this.#pointFormComponent);
    this.#pointFormComponent = null;

    document.removeEventListener('keydown', this.#handleEscapeKeydown);
  }

  #handleFormSubmit = (point) => {
    this.#handleDataChange(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      {id: crypto.randomUUID(), ...point},
    );
    this.destroy();
  };

  #handleFormReset = () => {
    this.destroy();
  };

  #handleEscapeKeydown = (evt) => {
    if (isEscapeEvent(evt)) {
      evt.preventDefault();
      this.destroy();
    }
  };
}
