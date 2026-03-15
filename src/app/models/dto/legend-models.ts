import { SeriesName } from '@models/dto';

export type LegendModel = CandleLegendModel | VolumeLegendModel | MacdLegendModel;

type baseLegendModel<T extends SeriesName> = {
  name: T;
};

interface CandleLegendModel extends baseLegendModel<'Candlestick'> {
  open: string;
  high: string;
  low: string;
  close: string;
  change: string;
  percentChange: string;
  color: string;
}

interface VolumeLegendModel extends baseLegendModel<'Volume'> {
  volume: string;
  color: string;
}

interface MacdLegendModel extends baseLegendModel<'MACD'> {
  macd: string;
  signal: string;
  histogram: string;
  color: string;
}
