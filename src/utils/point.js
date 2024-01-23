import {
  MINUTES_IN_DAY,
  MINUTES_IN_HOUR,
  DATE_COMPARISON_PRECISION_UNIT,
  PointDurationTimeFormat,
  PointDurationUnit
} from '../const.js';

import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

dayjs.extend(duration);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

export const humanizeDate = (date, format) => dayjs(date).format(format);

export const getHumanizedDuration = (dateFrom, dateTo) => {
  const from = dayjs(dateFrom);
  const to = dayjs(dateTo);

  const durationInDays = to.diff(from, PointDurationUnit.DAY);
  let daysDuration = '';

  const durationInMinutes = to.diff(from, PointDurationUnit.MINUTE);
  const remainingMinutesCount = durationInMinutes % MINUTES_IN_DAY;

  let timeDurationFormat = PointDurationTimeFormat.HOURS_MINUTES;

  if (durationInDays) {
    daysDuration = `${(durationInDays < 10) ? '0' : ''}${durationInDays}D`; // (1)
  } else {
    timeDurationFormat = (remainingMinutesCount < MINUTES_IN_HOUR)
      ? PointDurationTimeFormat.MINUTES
      : PointDurationTimeFormat.HOURS_MINUTES;
  }

  const timeDuration = dayjs.duration(remainingMinutesCount, PointDurationUnit.MINUTE).format(timeDurationFormat);

  return `${daysDuration} ${timeDuration}`.trim(); // (1)
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

export function isDatesEqual(dateA, dateB) {
  return dayjs(dateA).isSame(dateB, DATE_COMPARISON_PRECISION_UNIT);
}

export function isPastPoint(point) {
  return dayjs(point.dateTo).isBefore(dayjs(), DATE_COMPARISON_PRECISION_UNIT);
}

export function isPresentPoint(point) {
  return dayjs(point.dateFrom).isSameOrBefore(dayjs(), DATE_COMPARISON_PRECISION_UNIT) &&
    dayjs(point.dateTo).isSameOrAfter(dayjs(), DATE_COMPARISON_PRECISION_UNIT);
}

export function isFuturePoint(point) {
  return dayjs(point.dateFrom).isAfter(dayjs(), DATE_COMPARISON_PRECISION_UNIT);
}

/* (1)
 * Почему продолжительность составляется из двух строк (количество дней + количество часов и минут),
 * почему просто не используется dayjs.duration( to.diff(from) ).format('дни-часы-минуты')?
 * Во-первых, метод duration() не может правильно посчитать количество месяцев, дней, часов,
 * когда длительность больше месяца, так как количество дней в месяцах бывает разным,
 * а в расчётах месяц приравнивается 30 дням и 10 часам (https://github.com/iamkun/dayjs/issues/1433).
 * Во-вторых, метод format() может выводить количество дней только в диапазоне от 0 до 31,
 * что делает невозможным отобразить продолжительность более 31 дня.
 */
