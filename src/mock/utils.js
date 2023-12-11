export function getRandomInteger(from, to) {
  if (typeof from !== 'number' || typeof to !== 'number') {
    return NaN;
  }

  const min = Math.ceil(Math.min(from, to));
  const max = Math.floor(Math.max(from, to));

  return Math.floor(Math.random() * (max + 1 - min)) + min;
}

export function getRandomArrayItem(array) {
  return array[getRandomInteger(0, array.length - 1)];
}

export function createUniqueRandomIntegerGenerator(from, to) {
  const valuesMaxCount = to - from + 1;
  const previousValues = [];

  return () => {
    if (previousValues.length >= valuesMaxCount) {
      throw 'There are no unique values left in the specified range.';
    }

    let currentValue = getRandomInteger(from, to);

    while (previousValues.includes(currentValue)) {
      currentValue = getRandomInteger(from, to);
    }
    previousValues.push(currentValue);

    return currentValue;
  };
}
