import TripInfoView from '../view/trip-info-view.js';
import SortingView from '../view/sorting-view.js';
import PointsListView from '../view/points-list-view.js';
import LoadingView from '../view/loading-view.js';
import NoPointsView from '../view/no-points-view.js';
import { remove, render, RenderPosition } from '../framework/render.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import PointPresenter from './point-presenter.js';
import NewPointPresenter from './new-point-presenter.js';
import FiltersPresenter from './filters-presenter.js';
import { sortPointsByDateUp, sortPointsByPriceDown, sortPointsByDurationDown } from '../utils/point.js';
import { SortType, FilterType, UserAction, UpdateType } from '../const.js';
import { filter } from '../utils/filters.js';

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

export default class TripPresenter {
  #pointsListComponent = new PointsListView();
  #sortingComponent = null;
  #infoComponent = null;
  #loadingComponent = new LoadingView();
  #noPointsComponent = null;
  #filtersContainer = null;
  #filtersModel = null;
  #pointsContainer = null;
  #infoContainer = null;
  #pointsModel = null;
  #newPointPresenter = null;
  #isLoading = true;
  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT,
  });

  #pointPresenter = new Map();
  #currentSortType = SortType.DATA_UP;
  #currentFilterType = FilterType.EVERYTHING;

  constructor({ filtersContainer, filtersModel, pointsContainer, infoContainer, pointsModel, onNewPointFormDestroy }) {
    this.#filtersContainer = filtersContainer;
    this.#filtersModel = filtersModel;
    this.#pointsContainer = pointsContainer;
    this.#pointsModel = pointsModel;
    this.#infoContainer = infoContainer;

    this.#newPointPresenter = new NewPointPresenter({
      listElement: this.#pointsListComponent.element,
      onDataChange: this.#handlePointViewAction,
      onDestroy: onNewPointFormDestroy,
    });

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filtersModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    this.#currentFilterType = this.#filtersModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = filter[this.#currentFilterType](points);

    switch(this.#currentSortType) {
      case SortType.DURATION_DOWN:
        return filteredPoints.sort(sortPointsByDurationDown);
      case SortType.PRICE_DOWN:
        return filteredPoints.sort(sortPointsByPriceDown);
      default:
        return filteredPoints.sort(sortPointsByDateUp);
    }
  }

  #getAllPointsSortedByDateUp() {
    const points = this.#pointsModel.points;

    return points.sort(sortPointsByDateUp);
  }

  get offers() {
    return this.#pointsModel.offers;
  }

  get destinations() {
    return this.#pointsModel.destinations;
  }

  init() {
    this.#renderFilters();
    this.#renderTrip();
  }

  createPoint() {
    this.#currentSortType = SortType.DATA_UP;
    this.#filtersModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newPointPresenter.init([...this.#pointsModel.offers], [...this.#pointsModel.destinations]);
  }

  #handlePointModeChange = () => {
    this.#newPointPresenter.destroy();
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  #handlePointViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.ADD_POINT:
        this.#newPointPresenter.setSaving();
        try {
          await this.#pointsModel.addPoint(updateType, update);
        } catch (err) {
          this.#newPointPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_POINT:
        this.#pointPresenter.get(update.id).setDeleting();
        try {
          await this.#pointsModel.deletePoint(updateType, update);
        } catch (err) {
          this.#pointPresenter.get(update.id).setAborting();
        }
        break;
      case UserAction.UPDATE_POINT:
        this.#pointPresenter.get(update.id).setSaving();
        try {
          await this.#pointsModel.updatePoint(updateType, update);
        } catch (err) {
          this.#pointPresenter.get(update.id).setAborting();
        }
        break;
    }

    this.#uiBlocker.unblock();
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenter.get(data.id).init(data, [...this.#pointsModel.offers], [...this.#pointsModel.destinations]);
        break;
      case UpdateType.MINOR:
        this.#clearTrip();
        this.#renderTrip();
        break;
      case UpdateType.MAJOR:
        this.#clearTrip({ resetSortType: true });
        this.#renderTrip();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderTrip();
        break;
    }
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearTrip();
    this.#renderTrip();
  };

  #renderFilters() {
    const filtersPresenter = new FiltersPresenter({
      filtersContainer: this.#filtersContainer,
      filtersModel: this.#filtersModel,
      pointsModel: this.#pointsModel,
    });
    filtersPresenter.init();
  }

  #renderSorting() {
    this.#sortingComponent = new SortingView({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange,
    });

    render(this.#sortingComponent, this.#pointsContainer, RenderPosition.AFTERBEGIN);
  }

  #renderInfo() {
    this.#infoComponent = new TripInfoView({
      points: this.#getAllPointsSortedByDateUp(),
      destinations: [...this.#pointsModel.destinations],
      offers: [...this.#pointsModel.offers],
    });

    render(this.#infoComponent, this.#infoContainer, RenderPosition.AFTERBEGIN);
  }

  #renderPointsList() {
    render(this.#pointsListComponent, this.#pointsContainer);
    this.#renderPoints();
  }

  #renderLoading() {
    render(this.#loadingComponent, this.#pointsContainer);
  }

  #renderNoPoints() {
    this.#noPointsComponent = new NoPointsView({
      currentFilterType: this.#currentFilterType,
    });

    render(this.#noPointsComponent, this.#pointsContainer);
  }

  #renderPoint(point, offers, destinations) {
    const pointPresenter = new PointPresenter({
      listElement: this.#pointsListComponent.element,
      onDataChange: this.#handlePointViewAction,
      onModeChange: this.#handlePointModeChange,
    });

    pointPresenter.init(point, offers, destinations);
    this.#pointPresenter.set(point.id, pointPresenter);
  }

  #renderPoints() {
    this.points.forEach((point) =>
      this.#renderPoint(point, [...this.#pointsModel.offers], [...this.#pointsModel.destinations]));
  }

  #clearPoints() {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();
  }

  #clearTrip({ resetSortType = false} = {}) {
    this.#newPointPresenter.destroy();
    this.#clearPoints();

    remove(this.#sortingComponent);
    remove(this.#loadingComponent);
    remove(this.#infoComponent);

    if (this.#noPointsComponent) {
      remove(this.#noPointsComponent);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DATA_UP;
    }
  }

  #renderTrip() {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    if (this.points.length) {
      this.#renderInfo();
      this.#renderSorting();
      this.#renderPointsList();
    } else {
      this.#renderNoPoints();
    }
  }
}
