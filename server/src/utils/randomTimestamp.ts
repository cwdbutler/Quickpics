// returns a random ISO timestamp within the last week

export const randomTimestamp = () => {
  const randomNum = Math.floor(Math.random() * 7 * 1000 * 60 * 60 * 24);
  const dateTime = new Date(Date.now() - randomNum);
  return dateTime.toISOString();
};
