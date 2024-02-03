import { render, replace, remove } from '../framework/render.js';
import FiltersView from '../view/filters-view.js';
import { FilterType, UpdateType } from '../const.js';
import { filter } from '../utils/filters.js';

export default class FiltersPresenter {
  #filtersContainer = null;
  #filtersModel = null;
  #pointsModel = null;

  #filtersComponent = null;

  constructor({ filtersContainer, filtersModel, pointsModel }) {
    this.#filtersContainer = filtersContainer;
    this.#filtersModel = filtersModel;
    this.#pointsModel = pointsModel;

    this.#filtersModel.addObserver(this.#handleModelEvent);
    this.#pointsModel.addObserver(this.#handleModelEvent);
  }

  get filters() {
    const points = this.#pointsModel.points;

    return [
      {
        type: FilterType.EVERYTHING,
        name: 'everything',
        count: points.length
      },
      {
        type: FilterType.FUTURE,
        name: 'future',
        count: filter[FilterType.FUTURE](points).length,
      },
      {
        type: FilterType.PAST,
        name: 'past',
        count: filter[FilterType.PAST](points).length,
      },
      {
        type: FilterType.PRESENT,
        name: 'present',
        count: filter[FilterType.PRESENT](points).length,
      },
    ];
  }

  init() {
    const filters = this.filters;
    const prevFiltersComponent = this.#filtersComponent;

    this.#filtersComponent = new FiltersView({
      filters,
      currentFilterType: this.#filtersModel.filter,
      onFilterTypeChange: this.#handleFilterTypeChange,
    });

    if (prevFiltersComponent === null) {
      render(this.#filtersComponent, this.#filtersContainer);
      return;
    }

    replace(this.#filtersComponent, prevFiltersComponent);
    remove(prevFiltersComponent);
  }

  #handleModelEvent = () => {
    this.init();
  };

  #handleFilterTypeChange = (filterType) => {
    if (this.#filtersModel.filter === filterType) {
      return;
    }

    this.#filtersModel.setFilter(UpdateType.MAJOR, filterType);
  };
}
