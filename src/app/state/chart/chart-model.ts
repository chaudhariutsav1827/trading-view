import { Time } from 'lightweight-charts';

export type Range = {
  start: Time;
  end: Time;
};

export interface ChartState {
  range?: Range;
}

export const DEFAULT_CHART_STATE: ChartState = {
  range: undefined,
};
