import { effect, Injectable, signal } from '@angular/core';
import { DEFAULT_SETTINGS, SettingsState, Timeframe, Symbol } from './settings-model';
import { SeriesType } from '@core/constants/enums';

@Injectable({
  providedIn: 'root',
})
export class SettingsStore {
  private settings = signal<SettingsState>(DEFAULT_SETTINGS);

  readonly settings$ = this.settings.asReadonly();
  readonly getChartType = () => this.settings$().chartType;
  readonly getSymbol = () => this.settings$().symbol;
  readonly getTimeframe = () => this.settings$().timeframe;
  readonly getTheme = () => this.settings$().theme;
  readonly getRange = () => this.settings$().range;

  constructor() {
    this.#loadSettings();
    effect(() => {
      this.#saveSettings();
    });
  }

  setTheme(theme: 'dark' | 'light') {
    this.settings.update((s) => ({ ...s, theme }));
  }

  setChartType(chartType: SeriesType) {
    this.settings.update((s) => ({ ...s, chartType }));
  }

  setTimeframe(timeframe: Timeframe) {
    this.settings.update((s) => ({ ...s, timeframe }));
  }

  setSymbol(symbol: Symbol) {
    this.settings.update((s) => ({ ...s, symbol }));
  }

  #loadSettings() {
    const settings = localStorage.getItem('settings');
    if (settings) {
      this.settings.set(JSON.parse(settings));
    }
  }

  #saveSettings() {
    localStorage.setItem('settings', JSON.stringify(this.settings()));
    console.log('Settings changed', this.settings());
  }
}
