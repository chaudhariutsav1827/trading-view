export interface RsiModel {
  rsi: number;
  ema: number;
  date: string;
  rsiUpperBand?: number;
  rsiLowerBand?: number;
  rsiMiddleBand?: number;
}
