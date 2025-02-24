export const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number): [string, 'km' | 'm'] => {
  const R = 6371;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  if (R * c < 1) {
    return [(R * c * 1000).toFixed(2), 'm'];
  }
  return [(R * c).toFixed(2), 'km'];
};
