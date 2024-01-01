export const POINT_DATE_FORMAT = 'MMM D';
export const POINT_TIME_FORMAT = 'HH:mm';

export const MINUTES_IN_HOUR = 60;
export const MINUTES_IN_DAY = 1440;

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

export const SortType = {
  DATA_UP: 'data-up',
  PRICE_DOWN: 'price-down',
  DURATION_DOWN: 'time-down',
};
