import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { SeriesType } from '@core/constants/enums';
import { LegendService } from '@services/legend-service';

@Component({
  selector: 'app-chart-legends',
  standalone: true,
  imports: [],
  templateUrl: './chart-legends.html',
  styleUrl: './chart-legends.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartLegends {
  readonly chartContainer = input<HTMLDivElement | null>(null);
  readonly SeriesTypes = SeriesType;

  constructor(protected legendService: LegendService) {}

  updatePanePositions() {
    this.legendService.updatePanePositions(this.chartContainer());
  }
}
