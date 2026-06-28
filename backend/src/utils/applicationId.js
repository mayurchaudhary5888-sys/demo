const pad = (value, size) => String(value).padStart(size, "0");

export const generateApplicationId = () => {
  const date = new Date();
  const yyyymmdd = `${date.getFullYear()}${pad(date.getMonth() + 1, 2)}${pad(date.getDate(), 2)}`;
  const randomPart = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `APP-${yyyymmdd}-${randomPart}`;
};
