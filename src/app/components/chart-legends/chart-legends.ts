import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { LegendService } from '@services/legend-service';
import { SeriesLegendHost } from './directive/series-legend-host';
import { AppStore } from '@state/app-store';
import { SeriesModel } from '@state/series/series-model';

@Component({
  selector: 'app-chart-legends',
  standalone: true,
  imports: [SeriesLegendHost],
  templateUrl: './chart-legends.html',
  styleUrl: './chart-legends.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartLegends {
  constructor(
    protected appStore: AppStore,
    protected legendService: LegendService,
  ) {}

  onToggleVisibility(series: SeriesModel) {
    const isVisible = series.liveOptions()?.visible;
    this.appStore.series.applyOptions(series.id, { visible: !isVisible });
  }

  onOpenSettings(s: SeriesModel) {}

  onOpenMenu(series: SeriesModel) {}
}
