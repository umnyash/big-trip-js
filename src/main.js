import TripPresenter from './presenter/trip-presenter.js';
import PointsModel from './model/points-model.js';
import FiltersModel from './model/filters-model.js';
import NewPointButtonView from './view/new-point-button-view.js';
import { render } from './framework/render.js';
import PointsApiService from './service/points-api-service.js';

const AUTHORIZATION = 'Basic umnyash777';
const END_POINT = 'https://22.objects.htmlacademy.pro/big-trip';

const filterContainerElement = document.querySelector('.trip-controls__filters');
const pointsContainerElement = document.querySelector('.trip-events');
const newPointButtonContainerElement = document.querySelector('.trip-main');

const pointsModel = new PointsModel({
  pointsApiService: new PointsApiService(END_POINT, AUTHORIZATION),
});
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


tripPresenter.init();
pointsModel.init()
  .finally(() => {
    render(newPointButtonComponent, newPointButtonContainerElement);
  });
