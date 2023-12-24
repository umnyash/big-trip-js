import { MINUTES_IN_DAY, MINUTES_IN_HOUR, POINT_DURATION_MAIN_UNIT, PointDurationFormat } from '../const.js';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

export const humanizeDate = (date, format) => dayjs(date).format(format);

export const getHumanizedDuration = (dateFrom, dateTo) => {
  const from = dayjs(dateFrom);
  const to = dayjs(dateTo);

  const durationInMinutes = to.diff(from, POINT_DURATION_MAIN_UNIT);
  let durationFormat = PointDurationFormat.DAYS_HOURS_MINUTES;

  if (durationInMinutes < MINUTES_IN_DAY) {
    durationFormat = PointDurationFormat.HOURS_MINUTES;
  }

  if (durationInMinutes < MINUTES_IN_HOUR) {
    durationFormat = PointDurationFormat.MINUTES;
  }

  return dayjs.duration(durationInMinutes, POINT_DURATION_MAIN_UNIT).format(durationFormat);
};

export const convertFirstCharacterToUpperCase = (string) => `${string[0].toUpperCase()}${string.slice(1)}`;

export function sortPointsByDateUp(pointA, pointB) {
  return dayjs(pointA.dateFrom).diff(dayjs(pointB.dateFrom));
}

export function sortPointsByPriceDown(pointA, pointB) {
  return pointB.basePrice - pointA.basePrice;
}

export function sortPointsByDurationDown(pointA, pointB) {
  const pointADuration = dayjs(pointA.dateTo).diff(pointA.dateFrom);
  const pointBDuration = dayjs(pointB.dateTo).diff(pointB.dateFrom);

  return pointBDuration - pointADuration;
}
