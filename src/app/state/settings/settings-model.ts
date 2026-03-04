import { SeriesType, StockType } from '@core/constants/enums';

export interface SettingsState {
  theme: 'dark' | 'light';
  chartType: SeriesType;
  timeframe: Timeframe;
  symbol: Symbol;
  range?: Range;
}

export type Timeframe = {
  label: string;
  value: number;
};

export type Range = {
  start: number;
  end: number;
};

export const TIMEFRAME_OPTIONS: Timeframe[] = [
  { label: '1m', value: 1 },
  { label: '5m', value: 5 },
  { label: '15m', value: 15 },
  { label: '30m', value: 30 },
  { label: '1h', value: 60 },
  { label: '4h', value: 240 },
  { label: '1d', value: 1440 },
  { label: '1w', value: 10080 },
  { label: '1M', value: 43200 },
];

export interface Symbol {
  symbol: string;
  id: number;
  type: StockType;
  expiry?: string;
  strike?: number;
  optionType?: 'call' | 'put';
}

const defaultSymbol: Symbol = {
  symbol: 'NIFTY',
  id: 1,
  type: StockType.Equity,
};

export const DEFAULT_SETTINGS: SettingsState = {
  theme: 'dark',
  chartType: SeriesType.CANDLE,
  timeframe: TIMEFRAME_OPTIONS[0],
  symbol: defaultSymbol,
};
