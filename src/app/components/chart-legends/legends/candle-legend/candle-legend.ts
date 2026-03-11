import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-candle-legend',
  standalone: true,
  templateUrl: './candle-legend.html',
  styleUrl: '../legends.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CandleLegend {
  series = input<any | undefined>();

  value = computed(() => {
    return this.series()?.value();
  });

  color = computed(() => {
    return this.value()?.color;
  });
}
