import FiltersView from '../view/filters-view.js';
import SortingView from '../view/sorting.js';
import EventsListView from '../view/events-list-view.js';
import EventFormView from '../view/event-form-view.js';
import EventView from '../view/event-view.js';
import { render } from '../render.js';

export default class TripPresenter {
  eventsListComponent = new EventsListView();

  constructor(filterContainerElement, eventsContainerElement) {
    this.filterContainer = filterContainerElement;
    this.eventsContainer = eventsContainerElement;
  }

  init() {
    render(new FiltersView(), this.filterContainer);
    render(new SortingView(), this.eventsContainer);
    render(this.eventsListComponent, this.eventsContainer);
    render(new EventFormView(), this.eventsListComponent.getElement());

    for (let i = 0; i < 3; i++) {
      render(new EventView(), this.eventsListComponent.getElement());
    }
  }
}
