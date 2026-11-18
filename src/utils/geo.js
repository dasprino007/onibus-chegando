export function distanciaKm(lat1, lon1, lat2, lon2) {
  const R = 6371, rad = (x) => (x * Math.PI) / 180;
  const a =
    Math.sin(rad(lat2 - lat1) / 2) ** 2 +
    Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(rad(lon2 - lon1) / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

export function minutosAte(hrConsulta, hrChegada) {
  const toMin = (h) => { const [a, b] = h.split(':').map(Number); return a * 60 + b; };
  return toMin(hrChegada) - toMin(hrConsulta);
}