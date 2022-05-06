import { Star } from "./Star";
const sol: Star = {
  idx: 0,
  x: 0,
  y: 0,
  z: 0,
  dispNames: ["Sol"],
  actualMagnitude: "-26.74",
  absoluteMagnitude: "4.83",
  spectralType: "G2V",
  distance: 0,
  ra: 0,
  dec: 0,
};

export const loadCatalog = async (): Promise<Star[]> => {
  const resp = await fetch('/stars.csv');
  const stars = await resp.text();

  const data = stars.split(/\r\n|\n/).map((row, idx) => {
    const cols = row.split(",")
    return {
      idx: idx + 1,
      x: toNum(trim(`${cols[11]}`)),
      y: toNum(trim(`${cols[12]}`)),
      z: toNum(trim(`${cols[13]}`)),
      dispNames: cols.slice(14).map(trim),
      actualMagnitude: trim(`${cols[1]}`),
      absoluteMagnitude: trim(`${cols[2]}`),
      spectralType: trim(`${cols[3]}`),
      distance: toNum(trim(`${cols[10]}`)),
      ra: toNum(trim(`${cols[4]}`)),
      dec: toNum(trim(`${cols[5]}`)),
    }
  }).filter((s) => s.x !== 0 && s.y !== 0 && s.z !== 0);
  return [sol, ...data];
}

const trim = (s: string): string => {
  return s.replaceAll("\"", "").trim();
}
const toNum = (s: string): number | null => {
  const rtn = parseFloat(s);
  return Number.isNaN(rtn) ? null : rtn;
}
