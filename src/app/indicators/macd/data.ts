import { CustomData } from 'lightweight-charts';

/**
 * MACD Series Data
 */
export interface MACDData extends CustomData {
  macd: number;
  signal: number;
  histogram: number;
}
