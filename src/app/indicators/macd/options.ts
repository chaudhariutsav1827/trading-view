import { CustomSeriesOptions, customSeriesDefaultOptions } from 'lightweight-charts';

export interface MACDSeriesOptions extends CustomSeriesOptions {
  macdLineColor: string;
  signalLineColor: string;
  histogramUpColor: string;
  histogramDownColor: string;
}

export const defaultOptions: MACDSeriesOptions = {
  ...customSeriesDefaultOptions,
  macdLineColor: '#049981',
  signalLineColor: '#F23645',
  histogramUpColor: '#878993',
  histogramDownColor: '#878993',
} as const;
