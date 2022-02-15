import dayjs from "dayjs";
import relativetime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";

dayjs.extend(relativetime);
dayjs.extend(updateLocale);

dayjs.updateLocale("en", {
  relativeTime: {
    future: "now",
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

export const timeSince = (date: any) => {
  if (dayjs(date).isBefore(dayjs(), "year")) {
    return dayjs(date).format("MMMM D, YYYY");
  }
  if (dayjs(date).isBefore(dayjs().subtract(1, "week"))) {
    return dayjs(date).format("MMMM D");
  }

  return dayjs(date).fromNow();
};
