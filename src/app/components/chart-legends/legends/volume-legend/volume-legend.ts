import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-volume-legend',
  templateUrl: './volume-legend.html',
  standalone: true,
  styleUrl: '../legends.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VolumeLegend {
  series = input<any>();

  value = computed(() => {
    return this.series()?.value();
  });

  color = computed(() => {
    return this.value()?.color;
  });
}
