import { CandleModel, IndicatorModel } from '@models/dto';
import { CandlestickData, Time } from 'lightweight-charts';

export interface ChartDataResponse {
  candles: CandleModel[];
  indicators?: IndicatorModel;
}
