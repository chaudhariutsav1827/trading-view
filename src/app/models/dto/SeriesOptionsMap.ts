import { MACDSeriesOptions } from 'app/indicators/macd/options';
import { SeriesType } from 'lightweight-charts';

// Extend SeriesOptionsMap to include your custom type
declare module 'lightweight-charts' {
  interface SeriesOptionsMap {
    MACD: MACDSeriesOptions;
    Volume: HistogramSeriesOptions;
  }
}

// map name -> type in one place
export const SeriesNameTypeMap = {
  Candlestick: 'Candlestick',
  HeikinAshi: 'Candlestick',
  Volume: 'Histogram',
  MACD: 'MACD',
} as const satisfies Record<string, SeriesType>;

export type SeriesName = keyof typeof SeriesNameTypeMap;
