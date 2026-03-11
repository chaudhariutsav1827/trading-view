import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-macd-legend',
  templateUrl: './macd-legend.html',
  standalone: true,
  styleUrl: '../legends.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MacdLegend {
  series = input<any>();

  value = computed(() => {
    return this.series()?.value();
  });

  color = computed(() => {
    return this.value()?.color;
  });

  params = computed(() => {
    return this.series()?.params;
  });

  options = computed(() => {
    return this.series()?.options;
  });
}
