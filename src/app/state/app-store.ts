import { Injectable } from '@angular/core';
import { SeriesStore } from './series/series-store';
import { SettingsStore } from './settings/settings-store';
import { LoaderStore } from './loader/loader-store';

@Injectable({
  providedIn: 'root',
})
export class AppStore {
  constructor(
    public readonly series: SeriesStore,
    public readonly settings: SettingsStore,
    public readonly loader: LoaderStore,
  ) {}
}
