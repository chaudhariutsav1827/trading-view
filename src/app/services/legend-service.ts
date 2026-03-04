import { computed, inject, Injectable, signal } from '@angular/core';
import { SeriesType } from '@core/constants/enums';
import { SeriesStore } from '@state/series/series-store';

@Injectable({
  providedIn: 'root',
})
export class LegendService {
  #storeService = inject(SeriesStore);

  readonly panes = computed(() => {
    const panes = new Map<number, any>();

    for (const s of this.#storeService.series$().series) {
      if (!panes.has(s.pane)) {
        panes.set(s.pane, {
          index: s.pane,
          series: [],
          top: signal(0),
        });
      }

      panes.get(s.pane).series.push(s);
    }
    return Array.from(panes.values());
  });

  constructor() {}

  updatePanePositions(chartContainer: HTMLDivElement | null) {
    if (!chartContainer) {
      console.log('Chart container not found');
      return;
    }

    const rows = chartContainer.querySelectorAll(
      '.tv-lightweight-charts table tr',
    ) as NodeListOf<HTMLTableRowElement>;

    const panes = this.panes();

    let top = 0;
    let paneIndex = 0;

    rows?.forEach((row) => {
      const height = row.offsetHeight;

      if (height > 5) {
        // ignore separators
        if (panes[paneIndex]) {
          panes[paneIndex].top.set(top + 6);
          paneIndex++;
        }

        top += height;
      }
    });
  }

  updateSeriesApi() {
    this.panes().forEach((p) => {
      p.series = [];
    });
    this.#storeService.series$().series.forEach((s) => {
      this.panes()[s.pane].series.push(s);
    });
  }

  updateLegendValues(param: any) {
    if (!param.seriesData) return;

    const panes = this.panes();

    for (const pane of panes) {
      for (const series of pane.series) {
        const price = param.seriesData.get(series.api);

        if (!price) continue;

        switch (series.type) {
          case SeriesType.CANDLE:
          case SeriesType.HeikinAshi:
            series.value.set({
              open: price.open,
              high: price.high,
              low: price.low,
              close: price.close,
            });
            break;

          case SeriesType.VOLUME:
            series.value.set({ volume: price.value });
            break;

          case SeriesType.MACD:
            series.value.set({
              macd: price.macd,
              signal: price.signal,
              hist: price.hist,
            });
            break;
        }
      }
    }

    console.log(this.panes()[0].series);
  }
}
