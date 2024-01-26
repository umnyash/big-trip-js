import TripPresenter from './presenter/trip-presenter.js';
import PointsModel from './model/points-model.js';
import FiltersModel from './model/filters-model.js';
import NewPointButtonView from './view/new-point-button-view.js';
import { render } from './framework/render.js';

const filterContainerElement = document.querySelector('.trip-controls__filters');
const pointsContainerElement = document.querySelector('.trip-events');
const newPointButtonContainerElement = document.querySelector('.trip-main');

const pointsModel = new PointsModel();
const filtersModel = new FiltersModel();

const tripPresenter = new TripPresenter({
  filtersContainer: filterContainerElement,
  filtersModel: filtersModel,
  pointsContainer: pointsContainerElement,
  infoContainer: newPointButtonContainerElement,
  pointsModel,
  onNewPointFormDestroy: handleNewPointFormClose,
});

const newPointButtonComponent = new NewPointButtonView({
  onClick: handleNewPointButtonClick,
});

function handleNewPointFormClose() {
  newPointButtonComponent.element.disabled = false;
}

function handleNewPointButtonClick() {
  tripPresenter.createPoint();
  newPointButtonComponent.element.disabled = true;
}

render(newPointButtonComponent, newPointButtonContainerElement);

tripPresenter.init();
