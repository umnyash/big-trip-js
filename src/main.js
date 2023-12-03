import TripPresenter from './presenter/trip-presenter.js';

const filterContainerElement = document.querySelector('.trip-controls__filters');
const eventsContainerElement = document.querySelector('.trip-events');

const tripPresenter = new TripPresenter(filterContainerElement, eventsContainerElement);
tripPresenter.init();
