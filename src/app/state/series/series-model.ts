import { SeriesType } from '@core/constants/enums';

export interface SeriesModel {
  id: number;
  name: string;
  type: SeriesType;
  api?: any;
  pane: number;
  params?: any;
  options?: any;
}

export interface SeriesState {
  series: SeriesModel[];
}

export const DEFAULT_SERIES: SeriesState = {
  series: [
    {
      id: 1,
      name: 'Candle',
      type: SeriesType.CANDLE,
      pane: 0,
      options: {
        upColor: '#00d4aa',
        downColor: '#ff4757',
        borderUpColor: '#00d4aa',
        borderDownColor: '#ff4757',
        wickUpColor: '#00d4aa',
        wickDownColor: '#ff4757',
      },
    },
    {
      id: 2,
      name: 'Volume',
      type: SeriesType.VOLUME,
      pane: 1,
      options: {},
      params: {},
    },
    {
      id: 3,
      name: 'MACD',
      type: SeriesType.MACD,
      pane: 2,
      options: {
        macdLineColor: '#00d4aa',
        signalLineColor: '#ff4757',
        histogramUpColor: '#00d4aa',
        histogramDownColor: '#ff4757',
      },
      params: {
        fastPeriods: 12,
        signalPeriods: 9,
        slowPeriods: 26,
      },
    },
  ],
};
