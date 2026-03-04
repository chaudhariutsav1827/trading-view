import { StockType } from '@core/constants/enums';

export interface ChartRangeRequest {
  stockId: number;
  candleLength: number;
  stockType: StockType;
}
