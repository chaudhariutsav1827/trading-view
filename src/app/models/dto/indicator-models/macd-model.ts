import { Time } from 'lightweight-charts';

export interface MacdModel {
  macd: number;
  signal: number;
  histogram: number;
  fastEma: number;
  slowEma: number;
  date: string;
}

export interface FormattedMacdData {
  time: Time;
  macd: number;
  signal: number;
  histogram: number;
}
