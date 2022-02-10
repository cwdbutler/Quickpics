export const sleep = (seconds: number) =>
  new Promise((result) => setTimeout(result, seconds * 1000));
