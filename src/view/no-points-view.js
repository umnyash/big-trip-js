import AbstractView from '../framework/view/abstract-view.js';
import { FilterType } from '../const.js';

const NoPointsTextType = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.PAST]: 'There are no past events now',
  [FilterType.PRESENT]: 'There are no present events now',
  [FilterType.FUTURE]: 'There are no future events now',
};

function createNoPointsTemplate(filterType) {
  const text = NoPointsTextType[filterType];

  return (`
    <p class="trip-events__msg">
      ${text}
    </p>
  `);
}

export default class NoPointsView extends AbstractView {
  #filterType = null;

  constructor({ currentFilterType }) {
    super();
    this.#filterType = currentFilterType;
  }

  get template() {
    return createNoPointsTemplate(this.#filterType);
  }
}
