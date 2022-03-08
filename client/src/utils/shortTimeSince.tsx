import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";

TimeAgo.addLocale(en);

export const shortTimeSince = (date: any) => {
  const timeAgo = new TimeAgo("en-GB");

  let time = timeAgo.format(new Date(date), "mini-now");

  return time;
};
