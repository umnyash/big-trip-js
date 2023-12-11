import { POINT_DURATION_UNIT, PointDuration } from './const';
import { getRandomInteger, getRandomArrayItem } from './utils.js';
import dayjs from 'dayjs';

export default function generateDates(pointsCount) {
  let dateFrom = null;
  let dateTo = dayjs();

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
