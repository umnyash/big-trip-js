import FiltersView from '../view/filters-view.js';
import SortingView from '../view/sorting-view.js';
import EventsListView from '../view/events-list-view.js';
import EventFormView from '../view/event-form-view.js';
import EventView from '../view/event-view.js';
import NoEventsView from '../view/no-events-view.js';
import { render, replace } from '../framework/render.js';
import { isEscapeEvent } from '../utils/common.js';

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
  #eventsListComponent = new EventsListView();
  #filterContainer = null;
  #eventsContainer = null;
  #pointsModel = null;
  #tripPoints = [];
  #offers = [];
  #destinations = [];

  constructor({ filterContainer, eventsContainer, pointsModel }) {
    this.#filterContainer = filterContainer;
    this.#eventsContainer = eventsContainer;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#tripPoints = [...this.#pointsModel.points];
    this.#offers = [...this.#pointsModel.offers];
    this.#destinations = [...this.#pointsModel.destinations];

    render(new FiltersView(), this.#filterContainer);

    if (this.#tripPoints.length) {
      render(new SortingView(), this.#eventsContainer);
      render(this.#eventsListComponent, this.#eventsContainer);

      for (let i = 0; i < this.#tripPoints.length; i++) {
        const type = this.#tripPoints[i].type;
        const offersIds = this.#tripPoints[i].offers;
        const offers = getSelectedOffers(this.#offers, type, offersIds);

        const destinationId = this.#tripPoints[i].destination;
        const destinationName = getDestinationName(this.#destinations, destinationId);

        this.#renderEvent(this.#tripPoints[i], offers, destinationName);
      }
    } else {
      render(new NoEventsView(), this.#eventsContainer);
    }
  }

  #renderEvent(point, offers, name) {
    const onEscapeKeyDown = (evt) => {
      if (isEscapeEvent(evt)) {
        evt.preventDefault();
        replaceFormToCard.call(this);
        document.removeEventListener('keydown', onEscapeKeyDown);
      }
    };

    const EventComponent = new EventView({
      point,
      offers,
      name,
      onEditButtonClick: () => {
        replaceCardToForm.call(this);
        document.addEventListener('keydown', onEscapeKeyDown);
      },
    });

    const EventFormComponent = new EventFormView({
      point,
      offers: this.#offers,
      destinations: this.#destinations,
      onFormSubmit: () => {
        replaceFormToCard.call(this);
        document.removeEventListener('keydown', onEscapeKeyDown);
      },
    });

    function replaceCardToForm() {
      replace(EventFormComponent, EventComponent);
    }

    function replaceFormToCard() {
      replace(EventComponent, EventFormComponent);
    }

    render(EventComponent, this.#eventsListComponent.element);
  }
}
