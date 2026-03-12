import { computed, effect, Injectable, signal } from '@angular/core';
import { ChartState, DEFAULT_CHART_STATE } from './chart-model';
import { Time } from 'lightweight-charts';

@Injectable({
  providedIn: 'root',
})
export class ChartStore {
  private chartState = signal<ChartState>(DEFAULT_CHART_STATE);

  readonly chartState$ = this.chartState.asReadonly();
  readonly range$ = computed(() => this.chartState().range);

  setRange(start: Time, end: Time) {
    this.chartState.update((s) => ({ ...s, range: { start, end } }));
  }
}
