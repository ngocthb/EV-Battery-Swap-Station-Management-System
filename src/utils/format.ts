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
