const MINUTES_IN_DAY = 1440;

export const POINTS_COUNT = 2;

export const POINT_DURATION_UNIT = 'minute';
export const DAY_UNIT = 'day';
export const PASSED_DAYS_MAX_COUNT = 30;

export const DESTINATION_NAMES = [
  'Geneva',
  'Chamonix',
  'Amsterdam',
];

export const TEXTS = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Sed sed nisi sed augue convallis suscipit in sed felis.',
  'Aliquam erat volutpat.',
  'Nunc fermentum tortor ac porta dapibus.',
  'In rutrum ac purus sit amet tempus.',
];

export const DESTINATION_PHOTOS = [
  {
    src: 'img/photos/1.jpg',
    description: 'photo-1-descripption',
  },
  {
    src: 'img/photos/2.jpg',
    description: 'photo-2-descripption',
  },
  {
    src: 'img/photos/3.jpg',
    description: 'photo-3-descripption',
  },
  {
    src: 'img/photos/4.jpg',
    description: 'photo-4-descripption',
  },
  {
    src: 'img/photos/5.jpg',
    description: 'photo-5-descripption',
  },
];

export const DestinationPhotosCount = {
  MIN: 0,
  MAX: 7,
};

export const DestinationDescriptionSentencesCount = {
  MIN: 0,
  MAX: 5,
};

export const OffersCount = {
  MIN: 0,
  MAX: 8,
};

export const OfferPrice = {
  MIN: 5,
  MAX: 120,
};

export const pointBasePrice = {
  MIN: 1,
  MAX: 2000,
};

export const PointDuration = {
  QUICK: {
    MIN: 5,
    MAX: 60,
  },
  MEDIUN: {
    MIN: 60,
    MAX: 1 * MINUTES_IN_DAY,
  },
  LONG: {
    MIN: 1 * MINUTES_IN_DAY,
    MAX: 60 * MINUTES_IN_DAY,
  },
};
