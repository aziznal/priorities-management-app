export function formatDate(date: string) {
  const formatter = new Intl.RelativeTimeFormat("en", { style: "narrow" });

  const now = new Date().valueOf();
  const convertedDate = new Date(date).valueOf();

  const timeDiff = Math.abs(now - convertedDate);

  const timeDiffInDays = -1 * Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const timeDiffInHours = -1 * Math.floor(timeDiff / (1000 * 60 * 60));
  const timeDiffInMinutes = -1 * Math.floor(timeDiff / (1000 * 60));

  if (timeDiffInDays !== 0) {
    return formatter.format(timeDiffInDays, "days");
  }

  if (timeDiffInHours !== 0) {
    return formatter.format(timeDiffInDays, "hours");
  }

  return formatter.format(timeDiffInMinutes, "minutes");
}
