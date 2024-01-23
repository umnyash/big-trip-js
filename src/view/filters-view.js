import AbstractView from '../framework/view/abstract-view.js';

function createFilterItemTemplate(filter, currentFilterType) {
  const { type, name } = filter;

  return (`
    <div class="trip-filters__filter">
      <input
        id="filter-${name}"
        class="trip-filters__filter-input  visually-hidden"
        type="radio"
        name="trip-filter"
        value=${type}
        ${type === currentFilterType ? 'checked' : ''}
      >
      <label
        class="trip-filters__filter-label"
        for="filter-${name}"
      >
        ${name}
      </label>
    </div>
  `);
}

function createFiltersTemplate(filters, currentFilterType) {
  const filterItemsTemplate = filters
    .map((filter) => createFilterItemTemplate(filter, currentFilterType))
    .join('');

  return(`
    <form class="trip-filters" action="#" method="get">
      ${filterItemsTemplate}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>
  `);
}

export default class FiltersView extends AbstractView {
  #filters = null;
  #currentFilter = null;
  #hadleFilterTypeChange = null;

  constructor({ filters, currentFilterType, onFilterTypeChange }) {
    super();

    this.#filters = filters;
    this.#currentFilter = currentFilterType;
    this.#hadleFilterTypeChange = onFilterTypeChange;

    this.element.addEventListener('change', this.#filterTypeChangeHandler);
  }

  get template() {
    return createFiltersTemplate(this.#filters, this.#currentFilter);
  }

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this.#hadleFilterTypeChange(evt.target.value);
  };
}
