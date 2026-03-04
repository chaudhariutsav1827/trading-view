export interface StModel {
  superTrend: number;
  upperBand: number;
  lowerBand: number;
  middleBand: number;
  date: string;
}

export interface MultipleStModel {
  [key: string]: StModel[];
}
