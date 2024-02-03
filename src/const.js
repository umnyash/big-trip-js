export const POINT_DATE_FORMAT = 'MMM D';
export const POINT_TIME_FORMAT = 'HH:mm';

export const MINUTES_IN_HOUR = 60;
export const MINUTES_IN_DAY = 1440;

export const DATE_COMPARISON_PRECISION_UNIT = 'm';

export const POINT_MIN_BASE_PRICE = 1;

export const POINTS_TYPES = [
  'taxi',
  'bus',
  'train',
  'ship',
  'drive',
  'flight',
  'check-in',
  'sightseeing',
  'restaurant',
];

export const PointDurationUnit = {
  MINUTE: 'minute',
  HOUR: 'hour',
  DAY: 'day',
};

export const PointDurationTimeFormat = {
  MINUTES: 'mm[M]',
  HOURS_MINUTES: 'HH[H] mm[M]',
};

export const KeyCode = Object.freeze({
  ESCAPE: 'Escape',
});

export const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PAST: 'past',
  PRESENT: 'present',
};

export const SortType = {
  DATA_UP: 'data-up',
  PRICE_DOWN: 'price-down',
  DURATION_DOWN: 'time-down',
};

export const UserAction = {
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
  UPDATE_POINT: 'UPDATE_POINT',
};

export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};
