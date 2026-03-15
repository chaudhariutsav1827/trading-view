import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { AppStore } from '@state/app-store';
import { SeriesModel } from '@state/series/series-model';

@Component({
  selector: 'app-candle-legend',
  standalone: true,
  templateUrl: './candle-legend.html',
  styleUrl: '../legends.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CandleLegend {
  appStore = inject(AppStore);
  series = input<SeriesModel | undefined>();

  isVisible = computed(() => {
    return this.series()?.liveOptions()?.visible;
  });

  legendValue = computed(() => {
    const legend = this.series()?.legend();
    if (!legend || legend.name !== 'Candlestick') return null;
    return legend;
  });

  color = computed(() => {
    return this.legendValue()?.color;
  });
}
