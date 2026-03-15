import { signal, WritableSignal } from '@angular/core';
import { LegendModel, SeriesName } from '@models/dto';
import { SeriesType } from 'lightweight-charts';

export interface SeriesModel {
  id: number;
  name: SeriesName;
  type: SeriesType;
  api?: any;
  pane: number;
  params?: any;
  options?: any;
  liveOptions: WritableSignal<any>;
  legend: WritableSignal<LegendModel | null>;
}

export interface SeriesState {
  series: SeriesModel[];
}

export const DEFAULT_SERIES: SeriesState = {
  series: [
    {
      id: 1,
      name: 'Candlestick',
      type: 'Candlestick',
      pane: 0,
      options: {
        upColor: '#00d4aa',
        downColor: '#ff4757',
        borderUpColor: '#00d4aa',
        borderDownColor: '#ff4757',
        wickUpColor: '#00d4aa',
        wickDownColor: '#ff4757',
      },
      liveOptions: signal({}),
      legend: signal(null),
    },
    {
      id: 2,
      name: 'Volume',
      type: 'Volume',
      pane: 1,
      options: {
        priceFormat: {
          type: 'volume',
        },
      },
      liveOptions: signal({}),
      params: {},
      legend: signal(null),
    },
    {
      id: 3,
      name: 'MACD',
      type: 'MACD',
      pane: 2,
      options: {
        macdLineColor: '#2962FF',
        signalLineColor: '#FF6D00',
        histogramUpColor: '#00d4aa',
        histogramDownColor: '#ff4757',
      },
      liveOptions: signal({}),
      params: {
        fastPeriods: 12,
        signalPeriods: 9,
        slowPeriods: 26,
      },
      legend: signal(null),
    },
  ],
};
