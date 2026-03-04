import { CandlestickData, Time } from 'lightweight-charts';
import { FormattedMacdData } from './indicator-models/macd-model';
import { FormattedVolumeData } from './indicator-models/volume-model';

export interface FormattedChartData {
  candles: CandlestickData<Time>[];
  volume?: FormattedVolumeData[];
  macd?: FormattedMacdData[];
}
