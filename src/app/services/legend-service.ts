import { computed, inject, Injectable, signal } from '@angular/core';
import { AppStore } from '@state/app-store';
import { MouseEventParams, Time } from 'lightweight-charts';

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
    // MouseEventParams<Time>
    if (!param.seriesData) return;

    const panes = this.panes();

    for (const pane of panes) {
      for (const series of pane.series) {
        const price = param.seriesData.get(series.api);

        if (!price) continue;

        switch (series.type) {
          case 'Candlestick':
          case 'HeikinAshi':
            const change = price.close - price.open;
            const percentChange = (change / price.open) * 100;
            series.legend.set({
              name: series.name,
              open: price.open?.toFixed(2),
              high: price.high?.toFixed(2),
              low: price.low?.toFixed(2),
              close: price.close?.toFixed(2),
              change: (change > 0 ? '+' : '') + change.toFixed(2),
              percentChange: (percentChange > 0 ? '+' : '') + percentChange.toFixed(3),
              color: price.color,
            });
            break;

          case 'Volume':
            series.legend.set({
              name: series.name,
              volume: this.#customVolumeFormater(price.value),
              color: price.color,
            });
            break;

          case 'MACD':
            series.legend.set({
              name: series.name,
              macd: price.macd?.toFixed(2),
              signal: price.signal?.toFixed(2),
              histogram: price.histogram?.toFixed(2),
              color:
                price.histogram > 0
                  ? series.options.histogramUpColor
                  : series.options.histogramDownColor,
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
