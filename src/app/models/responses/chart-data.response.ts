import { IndicatorDataResponse } from './indicator-data.respose';
import { CandleModel } from '@models/dto/indicator-models';

export interface ChartDataResponse {
  candles: CandleModel[];
  indicators?: IndicatorDataResponse;
}
