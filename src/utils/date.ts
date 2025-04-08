export const isSameDay = (date1: Date, date2: Date) => {
  if (date1.getFullYear() !== date2.getFullYear()) {
    return false;
  }

  if (date1.getMonth() !== date2.getMonth()) {
    return false;
  }

  if (date1.getDate() !== date2.getDate()) {
    return false;
  }
  return true;
};
