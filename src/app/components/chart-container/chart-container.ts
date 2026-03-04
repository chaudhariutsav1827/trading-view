import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  signal,
  viewChild,
} from '@angular/core';
import { createChart, IChartApi, LogicalRange, Time } from 'lightweight-charts';
import { CHART_OPTIONS } from '@core/constants/chart-options';
import { SettingsStore } from '@state/settings/settings-store';
import { Timeframe, TIMEFRAME_OPTIONS } from '@state/settings/settings-model';
import { ChartDataRequest } from '@models/requests';
import { ChartRepository } from '@repositories/chart-repository';
import { CANDLE_COUNTS, PREFETCH_THRESHOLD, RANGE_IDLE_DELAY } from '@core/constants/candle-counts';
import { HelperService } from '@core/services/helper-service';
import { ChartDataResponse } from '@models/responses';
import { SeriesStore } from '@state/series/series-store';
import { SeriesType } from '@core/constants/enums';
import { LoaderStore } from '@state/loader/loader-store';
import { ChartService } from '@services/chart-service';

@Component({
  selector: 'app-chart-container',
  imports: [],
  templateUrl: './chart-container.html',
  styleUrl: './chart-container.css',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartContainer implements AfterViewInit, OnDestroy {
  chartContainer = viewChild<ElementRef | null>('chartContainer');
  timeFrameOptions = TIMEFRAME_OPTIONS;
  totalCandles = signal(0);

  #chartApi: IChartApi | null = null;
  #isDragging = false;
  #oldestDateTime: Time | null = null;
  #newestDateTime: Time | null = null;
  #previousRange: LogicalRange | null = null;
  #shouldChartDataReset: boolean = true;
  #rangeChangeTimeout: any = null;

  //#region  constructor
  constructor(
    protected settingsStore: SettingsStore,
    protected loaderStore: LoaderStore,
    private seriesStore: SeriesStore,
    private helperService: HelperService,
    private chartService: ChartService,
    private chartRepository: ChartRepository,
  ) {}
  //#endregion

  //#region lifecycle hooks
  ngAfterViewInit() {
    this.#initializeChart();
  }

  ngOnDestroy() {
    this.#chartApi?.remove();
  }
  //#endregion

  //#region event handlers
  onTimeframeChange(timeframe: Timeframe) {
    this.settingsStore.setTimeframe(timeframe);
    this.#shouldChartDataReset = true;
    this.#getChartData();
  }

  onMouseDown() {
    this.#isDragging = true;
  }

  onMouseUp() {
    this.#isDragging = false;

    const timeScale = this.#chartApi?.timeScale();
    const range = timeScale?.getVisibleLogicalRange();
    if (!range) return;

    this.#onRangeChangeFinished(range);
  }

  #subscribeToChartTimeScale() {
    const timeScale = this.#chartApi?.timeScale();
    if (!timeScale) return;

    timeScale.subscribeVisibleLogicalRangeChange((range) => {
      if (!range) return;

      if (this.#isDragging) return;

      // Clear previous timer
      if (this.#rangeChangeTimeout) {
        clearTimeout(this.#rangeChangeTimeout);
      }

      // Start new idle timer
      this.#rangeChangeTimeout = setTimeout(() => {
        this.#onRangeChangeFinished(range);
      }, RANGE_IDLE_DELAY);
    });
  }
  //#endregion

  //#region private methods
  #initializeChart() {
    if (!this.chartContainer()) {
      console.log('Chart container not found');
      return;
    }
    const container = this.chartContainer()?.nativeElement;
    this.#chartApi = createChart(container, CHART_OPTIONS);
    this.#addSerieses();
    this.#getChartData();
    this.#subscribeToChartTimeScale();
  }

  #getChartData(isForwardLoading: boolean = false) {
    this.loaderStore.showLoader();
    const req = this.#getChartDataRequestModel(isForwardLoading);

    this.chartRepository.getChartData(req).subscribe({
      next: (res) => {
        if (res.data) this.#handleChartData(res.data, isForwardLoading);
      },
      complete: () => {
        this.loaderStore.hideLoader();
      },
    });
  }

  #getChartDataRequestModel(isForwardLoading: boolean = false): ChartDataRequest {
    const indicatorSeriesRequest: Record<string, any> = {};
    this.seriesStore.series$().series.forEach((s) => {
      switch (s.type) {
        case SeriesType.CANDLE:
        case SeriesType.HeikinAshi:
          return;
        case SeriesType.EMA:
        case SeriesType.ST:
          indicatorSeriesRequest[s.name] = { [s.id]: s.params };
          break;
        default:
          indicatorSeriesRequest[s.name] = s.params;
          break;
      }
    });

    const req: ChartDataRequest = {
      indicatorSeriesRequest,
      isIndicatorExists: Object.keys(indicatorSeriesRequest).length > 0,
      stockId: this.settingsStore.settings$().symbol.id,
      candleLength: this.settingsStore.settings$().timeframe.value,
      stockType: this.settingsStore.settings$().symbol.type,
      seriesType: this.settingsStore.settings$().chartType,
      candleCount: CANDLE_COUNTS.DEFAULT,
      isForwardLoading: isForwardLoading,
    };

    const lastDateTime = isForwardLoading ? this.#newestDateTime : this.#oldestDateTime;
    if (lastDateTime) {
      req.lastDateTime = this.helperService.tzToTime(lastDateTime as number);
    }

    return req;
  }

  #handleChartData(data: ChartDataResponse, isForwardLoading: boolean = false) {
    const chartData = this.chartService.formatChartData(data);

    const indicatorDataMap: Partial<Record<SeriesType, unknown[]>> = {
      [SeriesType.MACD]: chartData.macd,
      [SeriesType.VOLUME]: chartData.volume,
    };

    this.seriesStore.series$().series.forEach((s) => {
      if (!s.api) return;

      switch (s.type) {
        case SeriesType.CANDLE:
        case SeriesType.HeikinAshi:
          this.#updateSeriesData(s.api, chartData.candles, isForwardLoading);
          const updatedData = s.api.data();
          this.totalCandles.set(updatedData.length);
          this.#oldestDateTime = updatedData[0].time;
          this.#newestDateTime = updatedData[updatedData.length - 1].time;
          break;

        // case SeriesType.EMA: {
        //   const emaData = chartData.indicators?.ema?.[s.id];
        //   if (emaData) this.#updateSeriesData(s.api, emaData, isForwardLoading);
        //   break;
        // }

        // case SeriesType.ST: {
        //   const stData = chartData.indicators?.st?.[s.id];
        //   if (stData) this.#updateSeriesData(s.api, stData, isForwardLoading);
        //   break;
        // }

        default: {
          const indicatorData = indicatorDataMap[s.type];
          if (indicatorData) this.#updateSeriesData(s.api, indicatorData, isForwardLoading);
          break;
        }
      }
    });
    if (this.#shouldChartDataReset) this.#shouldChartDataReset = false;
  }

  #updateSeriesData(api: any, newData: unknown[], isForwardLoading: boolean) {
    if (this.#shouldChartDataReset) {
      api.setData(newData);
      return;
    }

    const existing = api.data();
    const merged = isForwardLoading ? [...existing, ...newData] : [...newData, ...existing];

    api.setData(merged);
  }

  #addSerieses() {
    this.seriesStore.series$().series.forEach((s) => {
      const seriesType = this.helperService.getSeriesType(s.type);
      const isCustomSeries = s.name.toLowerCase() === 'macd';
      let seriesApi;
      if (isCustomSeries) {
        seriesApi = this.#chartApi?.addCustomSeries(new (seriesType as any)(), s.options, s.pane);
      } else {
        seriesApi = this.#chartApi?.addSeries(seriesType as any, s.options, s.pane);
      }
      s.api = seriesApi;
    });
  }

  #onRangeChangeFinished(range: LogicalRange) {
    if (!this.#previousRange) {
      this.#previousRange = range;
      return;
    }

    if (range.from === this.#previousRange.from && range.to === this.#previousRange.to) return;

    this.#previousRange = range;
    console.log('Range change finished:', range);

    if (range.from < PREFETCH_THRESHOLD) {
      console.log('Loading older candles');
      this.#getChartData();
    }
    if (range.to > this.totalCandles() - PREFETCH_THRESHOLD) {
      console.log('Loading newer candles');
      // this.#getChartData(true);
    }
  }

  //#endregion
}
