import { effect, Injectable, signal, untracked } from '@angular/core';
import { DEFAULT_SERIES, SeriesModel, SeriesState } from './series-model';

@Injectable({
  providedIn: 'root',
})
export class SeriesStore {
  private series = signal<SeriesState>(DEFAULT_SERIES);

  readonly series$ = this.series.asReadonly();

  constructor() {
    this.#loadSeries();
    this.#onSeriesChanged();
  }

  #loadSeries() {
    const series = localStorage.getItem('series');
    const parsedSeries = series ? JSON.parse(series) : DEFAULT_SERIES;

    // adding value signal for legends to each series
    parsedSeries.series.forEach((s: SeriesModel) => {
      s.value = signal({});
    });

    this.series.set(parsedSeries);
  }

  #onSeriesChanged() {
    effect(() => {
      const current = this.series$();
      console.log('Series changed', current);
      untracked(() => {
        this.#saveSeries(current);
      });
    });
  }

  #saveSeries(current: SeriesState) {
    const seriesList = current.series.map((s) => {
      const { api, value, ...series } = s;
      return series;
    });
    const state = { series: seriesList };
    localStorage.setItem('series', JSON.stringify(state));
  }
}
