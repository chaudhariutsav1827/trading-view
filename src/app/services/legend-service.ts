import { computed, inject, Injectable, signal } from '@angular/core';
import { SeriesType } from '@core/constants/enums';
import { AppStore } from '@state/app-store';

@Injectable({
  providedIn: 'root',
})
export class LegendService {
  #appStore = inject(AppStore);

  readonly panes = computed(() => {
    const panes = new Map<number, any>();

    for (const s of this.#appStore.series.series$().series) {
      if (!panes.has(s.pane)) {
        panes.set(s.pane, {
          index: s.pane,
          series: [],
          top: signal(0),
        });
      }
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
    this.#appStore.series.series$().series.forEach((s) => {
      const pane = this.panes().find((p) => p.index === s.pane);
      if (!pane) return;
      pane.series.push(s);
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
            const change = price.close - price.open;
            const percentChange = (change / price.open) * 100;
            series.value.set({
              o: price.open?.toFixed(2), // open
              h: price.high?.toFixed(2), // high
              l: price.low?.toFixed(2), // low
              c: price.close?.toFixed(2), // close
              ch: (change > 0 ? '+' : '') + change.toFixed(2), // change
              pc: (percentChange > 0 ? '+' : '') + percentChange.toFixed(3), // percent change
              color: price.color, // color
            });
            break;

          case SeriesType.VOLUME:
            series.value.set({
              v: this.#customVolumeFormater(price.value), // volume
              color: price.color, // color
            });
            break;

          case SeriesType.MACD:
            series.value.set({
              m: price.macd?.toFixed(2), // macd
              s: price.signal?.toFixed(2), // signal
              h: price.histogram?.toFixed(2), // histogram
              color:
                price.histogram > 0
                  ? series.options.histogramUpColor
                  : series.options.histogramDownColor, // color
            });
            break;
        }
      }
    }
  }

  #customVolumeFormater = (dataValue: number): string => {
    const absValue = Math.abs(dataValue);

    if (absValue >= 1000000) {
      return `${(dataValue / 1000000).toFixed(2)}M`;
    }
    if (absValue >= 1000) {
      return `${(dataValue / 1000).toFixed(2)}K`;
    }
    return dataValue.toFixed(0);
  };
}
