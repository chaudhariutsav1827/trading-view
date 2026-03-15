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

  /**
   * Apply options to a series
   * @param seriesId Series ID
   * @param options Options to apply
   */
  applyOptions(seriesId: number, options: any) {
    const series = this.series().series.find((s) => s.id === seriesId);
    if (series) {
      series.api?.applyOptions({ ...series.options, ...options });
      series.liveOptions.set({ ...series.options, ...options });
    }
  }

  #loadSeries() {
    const series = localStorage.getItem('series');
    const parsedSeries = series ? JSON.parse(series) : DEFAULT_SERIES;

    // adding value signal for legends to each series
    parsedSeries.series.forEach((s: SeriesModel) => {
      s.legend = signal(null);
      s.liveOptions = signal({});
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
      const { api, liveOptions, legend, ...series } = s;
      return series;
    });
    const state = { series: seriesList };
    localStorage.setItem('series', JSON.stringify(state));
  }
}
