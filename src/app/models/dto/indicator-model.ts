import {
  AdxModel,
  BbModel,
  GreeksModel,
  IchimokuModel,
  MacdModel,
  MultipleEmaModel,
  RsModel,
  RsiModel,
  StModel,
  VolumeModel,
  VwapModel,
  WtModel,
} from './indicator-models';

export interface IndicatorModel {
  ema?: MultipleEmaModel[];
  bb?: BbModel[];
  ichimoku?: IchimokuModel[];
  macd?: MacdModel[];
  rsi?: RsiModel[];
  wt?: WtModel[];
  rs?: RsModel[];
  vwap?: VwapModel[];
  adx?: AdxModel[];
  st?: StModel[];
  iv?: GreeksModel[];
  oi?: GreeksModel[];
  delta?: GreeksModel[];
  theta?: GreeksModel[];
  gamma?: GreeksModel[];
  rho?: GreeksModel[];
  vega?: GreeksModel[];
  volume?: VolumeModel[];
}
