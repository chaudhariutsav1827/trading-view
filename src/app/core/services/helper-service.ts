import { Injectable } from '@angular/core';
import { SeriesType } from '@core/constants/enums';
import { MACDSeries } from 'app/indicators/macd/macd-series';
import { CandlestickSeries, HistogramSeries, LineSeries, Time } from 'lightweight-charts';

@Injectable({
  providedIn: 'root',
})
export class HelperService {
  /**
   * Convert time to UTC
   * @param time
   * @returns
   */
  timeToTz(time: string): Time {
    const date = new Date(time);
    return ((date.getTime() - date.getTimezoneOffset() * 60000) / 1000) as Time;
  }

  /**
   * Convert timestamp back to string
   * @param time
   * @returns
   */
  tzToTime(time: number): string {
    const date = new Date(time * 1000);
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
    return date.toISOString().split('.')[0] + 'Z';
  }

  /**
   * Get series type
   * @param type
   * @returns
   */
  getSeriesType(type: SeriesType) {
    switch (type) {
      case SeriesType.CANDLE:
      case SeriesType.HeikinAshi:
        return CandlestickSeries;
      case SeriesType.EMA:
      case SeriesType.BB:
      case SeriesType.RSI:
      case SeriesType.Ichimoku:
      case SeriesType.MACD:
        return MACDSeries;
      case SeriesType.WT:
      case SeriesType.RS:
      case SeriesType.VWAP:
      case SeriesType.ADX:
      case SeriesType.ST:
      case SeriesType.OI:
      case SeriesType.IV:
      case SeriesType.DELTA:
      case SeriesType.GAMMA:
      case SeriesType.THETA:
      case SeriesType.VEGA:
      case SeriesType.RHO:
        return LineSeries;
      case SeriesType.VOLUME:
        return HistogramSeries;
      default:
        return LineSeries;
    }
  }
}
