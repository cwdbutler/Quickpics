import dayjs from "dayjs";
import relativetime from "dayjs/plugin/relativeTime";

export const timeSince = (date: any) => {
  dayjs.extend(relativetime);

  return dayjs(date).fromNow();
};
