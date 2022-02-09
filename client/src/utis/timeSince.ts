import dayjs from "dayjs";
import relativetime from "dayjs/plugin/relativeTime";
dayjs.extend(relativetime);

export const timeSince = (date: any) => {
  if (dayjs(date).isBefore(dayjs(), "year")) {
    return dayjs(date).format("MMMM D, YYYY");
  }
  if (dayjs(date).isBefore(dayjs().subtract(1, "week"))) {
    return dayjs(date).format("MMMM D");
  }

  return dayjs(date).fromNow();
};
