import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { SeriesType } from '@core/constants/enums';
import { LegendService } from '@services/legend-service';
import { SeriesLegendHost } from './directive/series-legend-host';
import { AppStore } from '@state/app-store';

@Component({
  selector: 'app-chart-legends',
  standalone: true,
  imports: [SeriesLegendHost],
  templateUrl: './chart-legends.html',
  styleUrl: './chart-legends.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartLegends {
  readonly SeriesType = SeriesType;

  constructor(
    protected appStore: AppStore,
    protected legendService: LegendService,
  ) {}
}
