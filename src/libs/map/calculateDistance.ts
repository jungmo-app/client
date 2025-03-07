export const isEqualPositionToCenter = (center: google.maps.LatLng, position: google.maps.LatLng) => {
  const lat = center.lat().toFixed(6);
  const lng = center.lng().toFixed(6);

  const positionLat = position.lat().toFixed(6);
  const positionLng = position.lng().toFixed(6);

  if (lat === positionLat && lng === positionLng) {
    return true;
  }
  return false;
};

export const getRadius = (center: google.maps.LatLng, bounds: google.maps.LatLngBounds) => {
  const northEast = bounds.getNorthEast();
  const radius = google.maps.geometry.spherical.computeDistanceBetween(center, northEast);

  return radius;
};

export const isInRange = (center: google.maps.LatLng, bounds: google.maps.LatLngBounds, point: google.maps.LatLng) => {
  const distance = google.maps.geometry.spherical.computeDistanceBetween(center, point);
  const radius = getRadius(center, bounds);
  if (distance <= radius) {
    return true;
  }
  return false;
};
