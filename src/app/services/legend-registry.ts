import { Injectable, Type } from '@angular/core';
import { CandleLegend, MacdLegend, VolumeLegend } from '@components/chart-legends/legends';
import { SeriesName } from '@models/dto';

@Injectable({
  providedIn: 'root',
})
export class LegendRegistry {
  #registry = new Map<SeriesName, Type<any>>([
    ['Candlestick', CandleLegend],
    ['Volume', VolumeLegend],
    ['MACD', MacdLegend],
    // just register new component here when adding indicators
  ]);

  getLegendComponent(type: SeriesName): Type<any> | undefined {
    return this.#registry.get(type);
  }
}
