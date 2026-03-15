import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { SeriesModel } from '@state/series/series-model';

@Component({
  selector: 'app-volume-legend',
  templateUrl: './volume-legend.html',
  standalone: true,
  styleUrl: '../legends.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VolumeLegend {
  series = input<SeriesModel>();

  isVisible = computed(() => {
    return this.series()?.liveOptions()?.visible;
  });

  legendValue = computed(() => {
    const legend = this.series()?.legend();
    if (!legend || legend.name !== 'Volume') return null;
    return legend;
  });
}
