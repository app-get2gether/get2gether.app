export const haversineDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371e3;
  const p1 = (lat1 * Math.PI) / 180;
  const p2 = (lat2 * Math.PI) / 180;
  const deltaLon = lng2 - lng1;
  const deltaLambda = (deltaLon * Math.PI) / 180;
  const d = Math.acos(Math.sin(p1) * Math.sin(p2) + Math.cos(p1) * Math.cos(p2) * Math.cos(deltaLambda)) * R;
  return d;
};

export const formatHaversineDistance = (distance: number): string => {
  if (distance < 1000) {
    return `${Math.round(distance)} m`;
  }

  if (distance < 1000 * 1000) {
    return `${(distance / 1000).toFixed(1)} km`;
  }

  return `${(distance / (1000 * 1000)).toFixed(1)}k km`;
};
