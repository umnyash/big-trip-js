import FiltersView from '../view/filters-view.js';
import SortingView from '../view/sorting-view.js';
import EventsListView from '../view/events-list-view.js';
import NoEventsView from '../view/no-events-view.js';
import { render, RenderPosition } from '../framework/render.js';
import EventPresenter from './event-presenter.js';
import { updateItem } from '../utils/common.js';

export default class TripPresenter {
  #filtersComponent = new FiltersView();
  #eventsListComponent = new EventsListView();
  #sortingComponent = new SortingView();
  #noEventsComponent = new NoEventsView();
  #filterContainer = null;
  #eventsContainer = null;
  #pointsModel = null;
  #tripPoints = [];
  #offers = [];
  #destinations = [];
  #eventPresenter = new Map();

  constructor({ filterContainer, eventsContainer, pointsModel }) {
    this.#filterContainer = filterContainer;
    this.#eventsContainer = eventsContainer;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#tripPoints = [...this.#pointsModel.points];
    this.#offers = [...this.#pointsModel.offers];
    this.#destinations = [...this.#pointsModel.destinations];

    this.#renderFilters();
    this.#renderTrip();
  }

  #handleEventModeChange = () => {
    this.#eventPresenter.forEach((presenter) => presenter.resetView());
  };

  #handleEventChange = (updatedEvent) => {
    this.#tripPoints = updateItem(this.#tripPoints, updatedEvent);
    this.#eventPresenter.get(updatedEvent.id).init(updatedEvent, this.#offers, this.#destinations);
  };

  #renderFilters() {
    render(this.#filtersComponent, this.#filterContainer);
  }

  #renderSorting() {
    render(this.#sortingComponent, this.#eventsContainer, RenderPosition.AFTERBEGIN);
  }

  #renderEventsList() {
    render(this.#eventsListComponent, this.#eventsContainer);
    this.#renderEvents();
  }

  #renderNoEvents() {
    render(this.#noEventsComponent, this.#eventsContainer);
  }

  #renderEvent(point, offers, destinations) {
    const eventPresenter = new EventPresenter({
      listElement: this.#eventsListComponent.element,
      onDataChange: this.#handleEventChange,
      onModeChange: this.#handleEventModeChange,
    });

    eventPresenter.init(point, offers, destinations);
    this.#eventPresenter.set(point.id, eventPresenter);
  }

  #renderEvents() {
    this.#tripPoints.forEach((point) => this.#renderEvent(point, this.#offers, this.#destinations));
  }

  #clearEvents() {
    this.#eventPresenter.forEach((presenter) => presenter.destroy());
    this.#eventPresenter.clear();
  }

  #renderTrip() {
    if (this.#tripPoints.length) {
      this.#renderSorting();
      this.#renderEventsList();
    } else {
      this.#renderNoEvents();
    }
  }
}
