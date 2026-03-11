import { OptionType, StockType } from '@core/constants/enums';

export interface StockResponse {
  id: number;
  name: string;
  type: StockType;
  expiryDate?: string;
  optionType?: OptionType;
  strikePrice?: number;
  symbolName?: string;
}
