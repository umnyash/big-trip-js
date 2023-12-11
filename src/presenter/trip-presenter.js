import FiltersView from '../view/filters-view.js';
import SortingView from '../view/sorting.js';
import EventsListView from '../view/events-list-view.js';
import EventFormView from '../view/event-form-view.js';
import EventView from '../view/event-view.js';
import { render } from '../render.js';

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

export default class TripPresenter {
  eventsListComponent = new EventsListView();

  constructor({ filterContainer, eventsContainer, pointsModel }) {
    this.filterContainer = filterContainer;
    this.eventsContainer = eventsContainer;
    this.pointsModel = pointsModel;
  }

  init() {
    this.tripPoints = [...this.pointsModel.getPoints()];
    this.offers = [...this.pointsModel.getOffers()];
    this.destinations = [...this.pointsModel.getDestinations()];

    render(new FiltersView(), this.filterContainer);
    render(new SortingView(), this.eventsContainer);
    render(this.eventsListComponent, this.eventsContainer);

    render(
      new EventFormView({
        point: this.tripPoints[0],
        offers: this.offers,
        destinations: this.destinations,
      }),
      this.eventsListComponent.getElement()
    );

    render(
      new EventFormView({
        point: {},
        offers: this.offers,
        destinations: this.destinations,
      }),
      this.eventsListComponent.getElement()
    );

    for (let i = 0; i < this.tripPoints.length; i++) {
      const type = this.tripPoints[i].type;
      const offersIds = this.tripPoints[i].offers;
      const offers = getSelectedOffers(this.offers, type, offersIds);

      const destinationId = this.tripPoints[i].destination;
      const destinationName = getDestinationName(this.destinations, destinationId);

      render(
        new EventView({
          point: this.tripPoints[i],
          offers: offers,
          name: destinationName,
        }),
        this.eventsListComponent.getElement()
      );
    }
  }
}
