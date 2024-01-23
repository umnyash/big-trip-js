import { POINT_DURATION_UNIT, DAY_UNIT, PASSED_DAYS_MAX_COUNT, PointDuration } from './const';
import { getRandomInteger, getRandomArrayItem } from './utils.js';
import dayjs from 'dayjs';

export default function generateDates(pointsCount) {
  let dateFrom = null;

  const daysAgo = getRandomInteger(0, PASSED_DAYS_MAX_COUNT);
  let dateTo = dayjs().subtract(daysAgo, DAY_UNIT);

  const dates = Array.from({ length: pointsCount }, () => {
    const durationTypes = Object.keys(PointDuration);
    const durationTypeName = getRandomArrayItem(durationTypes);
    const duration = getRandomInteger(
      PointDuration[durationTypeName].MIN,
      PointDuration[durationTypeName].MAX
    );

    dateFrom = dateTo;
    dateTo = dateFrom.add(duration, POINT_DURATION_UNIT);

    return {
      from: dateFrom.toDate(),
      to: dateTo.toDate(),
    };
  });

  return dates;
}
