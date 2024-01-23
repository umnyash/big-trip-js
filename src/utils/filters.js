import { FilterType } from '../const.js';
import { isPastPoint, isPresentPoint, isFuturePoint } from './point.js';

export const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.PAST]: (points) => points.filter((point) => isPastPoint(point)),
  [FilterType.PRESENT]: (points) => points.filter((point) => isPresentPoint(point)),
  [FilterType.FUTURE]: (points) => points.filter((point) => isFuturePoint(point)),
};
