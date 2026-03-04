import { effect, Injectable, signal } from '@angular/core';
import { DEFAULT_SERIES, SeriesState } from './series-model';

@Injectable({
  providedIn: 'root',
})
export class SeriesStore {
  private series = signal<SeriesState>(DEFAULT_SERIES);

  readonly series$ = this.series.asReadonly();

  constructor() {
    this.#loadSeries();
    effect(() => {
      this.#saveSeries();
    });
  }

  #loadSeries() {
    const series = localStorage.getItem('series');
    if (series) {
      this.series.set(JSON.parse(series));
    }
  }

  #saveSeries() {
    const seriesList = this.series$().series.map((s) => {
      const { api, ...series } = s;
      return series;
    });
    const state = { series: seriesList };
    localStorage.setItem('series', JSON.stringify(state));
    console.log('Series changed', state);
  }
}
