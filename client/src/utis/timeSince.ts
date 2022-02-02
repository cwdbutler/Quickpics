import dayjs from "dayjs";
import relativetime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";

export const timeSince = (date: any, mode = { short: false }) => {
  dayjs.extend(relativetime);

  if (mode.short) {
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

    return dayjs(date).fromNow(true); // without "ago" suffix
  }

  return dayjs(date).fromNow();
};
