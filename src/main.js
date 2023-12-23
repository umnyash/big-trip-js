import TripPresenter from './presenter/trip-presenter.js';
import PointsModel from './model/points-model.js';

const filterContainerElement = document.querySelector('.trip-controls__filters');
const pointsContainerElement = document.querySelector('.trip-events');

const pointsModel = new PointsModel();

const tripPresenter = new TripPresenter({
  filterContainer: filterContainerElement,
  pointsContainer: pointsContainerElement,
  pointsModel,
});

tripPresenter.init();
