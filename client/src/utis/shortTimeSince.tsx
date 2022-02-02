import dayjs from "dayjs";
import relativetime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";

export const shortTimeSince = (date: any) => {
  dayjs.extend(relativetime);

  dayjs.extend(updateLocale);
  dayjs.updateLocale("en", {
    relativeTime: {
      future: "now",
      past: "now",
      s: "%d s",
      m: "%d m",
      mm: "%d m",
      h: "%d h",
      hh: "%d h",
      d: "%d h",
      dd: "%d d",
      M: "%d m",
      MM: "%d m",
      y: "%d y",
      yy: "%d y",
    },
  });

  const time = dayjs(date).fromNow(true); // without "ago" suffix

  // need to reset it to the original conflict so it doesn't conflict with the original timeSince
  dayjs.updateLocale("en", {
    relativeTime: {
      future: "in %s",
      past: "%s ago",
      s: "a few seconds",
      m: "a minute",
      mm: "%d minutes",
      h: "an hour",
      hh: "%d hours",
      d: "a day",
      dd: "%d days",
      M: "a month",
      MM: "%d months",
      y: "a year",
      yy: "%d years",
    },
  });

  return time;
};
