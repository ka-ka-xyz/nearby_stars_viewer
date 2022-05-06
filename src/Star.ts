
export interface Star {
  idx: number,
  x: number | null,
  y: number | null,
  z: number | null,
  dispNames: string[],
  actualMagnitude: string,
  absoluteMagnitude: string,
  spectralType: string,
  //距離(光年)
  distance: number | null,
  //赤経
  ra: number | null,
  //赤緯
  dec: number | null,
}
