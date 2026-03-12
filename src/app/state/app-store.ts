import { Injectable } from '@angular/core';
import { SeriesStore } from '@state/series/series-store';
import { SettingsStore } from '@state/settings/settings-store';
import { LoaderStore } from '@state/loader/loader-store';
import { ChartStore } from '@state/chart/chart-store';

@Injectable({
  providedIn: 'root',
})
export class AppStore {
  constructor(
    public readonly series: SeriesStore,
    public readonly settings: SettingsStore,
    public readonly chart: ChartStore,
    public readonly loader: LoaderStore,
  ) {}
}
