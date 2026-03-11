import { Injectable, Type } from '@angular/core';
import { CandleLegend, MacdLegend, VolumeLegend } from '@components/chart-legends/legends';
import { SeriesType } from '@core/constants/enums';

@Injectable({
  providedIn: 'root',
})
export class LegendRegistry {
  #registry = new Map<SeriesType, Type<any>>([
    [SeriesType.CANDLE, CandleLegend],
    [SeriesType.HeikinAshi, CandleLegend],
    [SeriesType.VOLUME, VolumeLegend],
    [SeriesType.MACD, MacdLegend],
    // just register new component here when adding indicators
  ]);

  getLegendComponent(type: SeriesType): Type<any> | undefined {
    return this.#registry.get(type);
  }
}
