import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { SeriesModel } from '@state/series/series-model';

@Component({
  selector: 'app-macd-legend',
  templateUrl: './macd-legend.html',
  standalone: true,
  styleUrl: '../legends.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MacdLegend {
  series = input<SeriesModel>();

  isVisible = computed(() => {
    return this.series()?.liveOptions()?.visible;
  });

  legendValue = computed(() => {
    const legend = this.series()?.legend();
    if (!legend || legend.name !== 'MACD') return null;
    return legend;
  });

  params = computed(() => {
    return this.series()?.params;
  });

  options = computed(() => {
    return this.series()?.options;
  });
}
