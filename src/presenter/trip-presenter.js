import FiltersView from '../view/filters-view.js';
import SortingView from '../view/sorting-view.js';
import PointsListView from '../view/points-list-view.js';
import NoPointsView from '../view/no-points-view.js';
import { render, RenderPosition } from '../framework/render.js';
import PointPresenter from './point-presenter.js';
import { updateItem } from '../utils/common.js';
import { sortPointsByDateUp, sortPointsByPriceDown, sortPointsByDurationDown } from '../utils/point.js';
import { SortType } from '../const.js';

export default class TripPresenter {
  #filtersComponent = new FiltersView();
  #pointsListComponent = new PointsListView();
  #sortingComponent = null;
  #noPointsComponent = new NoPointsView();
  #filterContainer = null;
  #pointsContainer = null;
  #pointsModel = null;

  #tripPoints = [];
  #offers = [];
  #destinations = [];
  #pointPresenter = new Map();
  #currentSortType = SortType.DATA_UP;

  constructor({ filterContainer, pointsContainer, pointsModel }) {
    this.#filterContainer = filterContainer;
    this.#pointsContainer = pointsContainer;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#tripPoints = [...this.#pointsModel.points];
    this.#offers = [...this.#pointsModel.offers];
    this.#destinations = [...this.#pointsModel.destinations];

    this.#renderFilters();
    this.#renderTrip();
  }

  #handlePointModeChange = () => {
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  #handlePointChange = (updatedPoint) => {
    this.#tripPoints = updateItem(this.#tripPoints, updatedPoint);
    this.#pointPresenter.get(updatedPoint.id).init(updatedPoint, this.#offers, this.#destinations);
  };

  #sortPoints(sortType) {
    switch (sortType) {
      case SortType.DURATION_DOWN:
        this.#tripPoints.sort(sortPointsByDurationDown);
        break;
      case SortType.PRICE_DOWN:
        this.#tripPoints.sort(sortPointsByPriceDown);
        break;
      default:
        this.#tripPoints.sort(sortPointsByDateUp);
    }

    this.#currentSortType = sortType;
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortPoints(sortType);
    this.#clearPoints();
    this.#renderPoints();
  };

  #renderFilters() {
    render(this.#filtersComponent, this.#filterContainer);
  }

  #renderSorting() {
    this.#sortingComponent = new SortingView({
      onSortTypeChange: this.#handleSortTypeChange,
    });

    render(this.#sortingComponent, this.#pointsContainer, RenderPosition.AFTERBEGIN);
  }

  #renderPointsList() {
    render(this.#pointsListComponent, this.#pointsContainer);
    this.#renderPoints();
  }

  #renderNoPoints() {
    render(this.#noPointsComponent, this.#pointsContainer);
  }

  #renderPoint(point, offers, destinations) {
    const pointPresenter = new PointPresenter({
      listElement: this.#pointsListComponent.element,
      onDataChange: this.#handlePointChange,
      onModeChange: this.#handlePointModeChange,
    });

    pointPresenter.init(point, offers, destinations);
    this.#pointPresenter.set(point.id, pointPresenter);
  }

  #renderPoints() {
    this.#tripPoints.forEach((point) => this.#renderPoint(point, this.#offers, this.#destinations));
  }

  #clearPoints() {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();
  }

  #renderTrip() {
    if (this.#tripPoints.length) {
      this.#renderSorting();
      this.#sortPoints(this.#currentSortType);
      this.#renderPointsList();
    } else {
      this.#renderNoPoints();
    }
  }
}
