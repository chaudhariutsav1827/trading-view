import { computed, effect, Injectable, signal, untracked } from '@angular/core';
import { DEFAULT_SETTINGS, SettingsState, Timeframe, Symbol } from './settings-model';
import { SeriesType } from '@core/constants/enums';
import { Time } from 'lightweight-charts';

@Injectable({
  providedIn: 'root',
})
export class SettingsStore {
  private settings = signal<SettingsState>(DEFAULT_SETTINGS);

  readonly settings$ = this.settings.asReadonly();
  readonly chartType$ = computed(() => this.settings().chartType, {
    equal: (a, b) => a === b,
  });
  readonly symbol$ = computed(() => this.settings().symbol, {
    equal: (a, b) => a.id === b.id && a.type === b.type,
  });
  readonly timeframe$ = computed(() => this.settings().timeframe, {
    equal: (a, b) => a.value === b.value,
  });
  readonly theme$ = computed(() => this.settings().theme, {
    equal: (a, b) => a === b,
  });

  constructor() {
    this.#loadSettings();
    this.#onSettingsChanged();
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

  #onSettingsChanged() {
    effect(() => {
      const current = this.settings();
      console.log('Settings changed', current);

      untracked(() => {
        localStorage.setItem('settings', JSON.stringify(current));
      });
    });
  }
}
