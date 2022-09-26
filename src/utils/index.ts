function doInParallel<T>(arr: T[], fn: (item: T) => any) {
  return Promise.all(arr.map(item => fn(item)));
}

function arrayDifference<T>(arrayOne: T[], arrayTwo: T[]): T[] {
  return arrayOne.filter(x => !arrayTwo.includes(x));
}

export { doInParallel, arrayDifference };
