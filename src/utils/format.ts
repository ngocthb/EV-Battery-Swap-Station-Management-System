export const isStationOpen = (openTime?: string, closeTime?: string) => {
  if (!openTime || !closeTime) return false;
  const now = new Date();
  const toMinutes = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };
  const current = now.getHours() * 60 + now.getMinutes();
  return current >= toMinutes(openTime) && current <= toMinutes(closeTime);
};

export const formatDateHCM = (dateStr: string) => {
  const date = new Date(dateStr);
  date.setHours(date.getHours() + 7);
  return date.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};
