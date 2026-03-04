import { SeriesType, StockType } from '@core/constants/enums';

export interface ChartDataRequest extends IndicatorSeriesRequest<IIndicatorsRequest> {
  isIndicatorExists: boolean;
}

export interface CandleRequest {
  lastDateTime?: string;
  candleCount: number;
  candleLength: number;
  isForwardLoading: boolean;
  stockId: number;
  seriesType: SeriesType;
  stockType: StockType;
}

export interface IndicatorSeriesRequest<T> extends CandleRequest {
  indicatorSeriesRequest: T;
}

export interface IIndicatorsRequest {
  ema?: object;
  bb?: object;
  rsi?: object;
  ichimoku?: object;
  macd?: object;
  wt?: object;
  rs?: object;
  vwap?: object;
  adx?: object;
  st?: object;
  oi?: object;
  iv?: object;
  delta?: object;
  gamma?: object;
  theta?: object;
  vega?: object;
  rho?: object;
  volume?: object;
}
