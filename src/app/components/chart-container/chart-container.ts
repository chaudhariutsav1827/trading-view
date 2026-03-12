import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  OnDestroy,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { createChart, IChartApi, LogicalRange, Time } from 'lightweight-charts';
import { CHART_OPTIONS } from '@core/constants/chart-options';
import { Timeframe, TIMEFRAME_OPTIONS } from '@state/settings/settings-model';
import { ChartDataRequest, ChartRangeRequest } from '@models/requests';
import { ChartRepository } from '@repositories/chart-repository';
import { CANDLE_COUNTS, PREFETCH_THRESHOLD, RANGE_IDLE_DELAY } from '@core/constants/candle-counts';
import { HelperService } from '@core/services/helper-service';
import { ChartDataResponse, ChartRangeResponse } from '@models/responses';
import { SeriesType } from '@core/constants/enums';
import { ChartService } from '@services/chart-service';
import { ChartLegends } from '../chart-legends/chart-legends';
import { LegendService } from '@services/legend-service';
import { AppStore } from '@state/app-store';

@Component({
  selector: 'app-chart-container',
  imports: [ChartLegends],
  templateUrl: './chart-container.html',
  styleUrl: './chart-container.css',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartContainer implements AfterViewInit, OnDestroy {
  chartContainer = viewChild<ElementRef | null>('chartContainer');
  timeFrameOptions = TIMEFRAME_OPTIONS;
  totalCandles = signal<number>(0);

  #chartApi: IChartApi | null = null;
  #isDragging = false;
  #oldestDateTime: Time | null = null;
  #newestDateTime: Time | null = null;
  #previousRange: LogicalRange | null = null;
  #shouldChartDataReset: boolean = true;
  #rangeChangeTimeout: any = null;
  #chartDataApiCalled: boolean = false;

  //#region  constructor
  constructor(
    protected appStore: AppStore,
    private helperService: HelperService,
    private chartService: ChartService,
    private chartRepository: ChartRepository,
    private legendService: LegendService,
  ) {
    this.#onSymbolChanged();
    this.#onTimeframeChanged();
    this.#onChartTypeChanged();
  }
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
    this.appStore.settings.setTimeframe(timeframe);
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

  #subscribeToCrosshairMove() {
    this.#chartApi?.subscribeCrosshairMove((param) => {
      if (!param) return;
      this.legendService.updateLegendValues(param);
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
    this.#updateLegends();
    this.#getRangeData();
    this.#subscribeToChartTimeScale();
    this.#subscribeToCrosshairMove();
  }

  #getRangeData() {
    this.appStore.loader.showLoader();
    const req = this.#getRangeDataRequestModel();

    this.chartRepository.getRangeData(req).subscribe({
      next: (res) => {
        if (res.data) this.#handleRangeData(res.data);
        this.#getChartData();
      },
      complete: () => {
        this.appStore.loader.hideLoader();
      },
    });
  }

  #getRangeDataRequestModel(): ChartRangeRequest {
    const settings = this.appStore.settings.settings$();

    const req: ChartRangeRequest = {
      stockId: settings.symbol.id,
      candleLength: settings.timeframe.value,
      stockType: settings.symbol.type,
    };

    return req;
  }

  #handleRangeData(data: ChartRangeResponse) {
    const startRange = this.helperService.timeToTz(data.startDate);
    const endRange = this.helperService.timeToTz(data.endDate);
    this.appStore.chart.setRange(startRange, endRange);
  }

  #getChartData(isForwardLoading: boolean = false) {
    if (this.#chartDataApiCalled) return;

    this.#chartDataApiCalled = true;

    this.appStore.loader.showLoader();
    const req = this.#getChartDataRequestModel(isForwardLoading);

    this.chartRepository.getChartData(req).subscribe({
      next: (res) => {
        if (res.data) this.#handleChartData(res.data, isForwardLoading);
      },
      complete: () => {
        this.appStore.loader.hideLoader();
        this.#chartDataApiCalled = false;
      },
    });
  }

  #getChartDataRequestModel(isForwardLoading: boolean = false): ChartDataRequest {
    const indicatorSeriesRequest: Record<string, any> = {};
    this.appStore.series.series$().series.forEach((s) => {
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

    const settings = this.appStore.settings.settings$();

    const req: ChartDataRequest = {
      indicatorSeriesRequest,
      isIndicatorExists: Object.keys(indicatorSeriesRequest).length > 0,
      stockId: settings.symbol.id,
      candleLength: settings.timeframe.value,
      stockType: settings.symbol.type,
      seriesType: settings.chartType,
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

    this.appStore.series.series$().series.forEach((s) => {
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
    if (this.#shouldChartDataReset) {
      this.#chartApi?.timeScale().fitContent();
      this.#shouldChartDataReset = false;
    }
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
    const mainChartPane = this.appStore.series
      .series$()
      .series.find((s) => s.type === SeriesType.CANDLE || s.type === SeriesType.HeikinAshi)?.pane;

    this.appStore.series.series$().series.forEach((s) => {
      const seriesType = this.helperService.getSeriesType(s.type);
      const isCustomSeries = this.helperService.isCustomSeries(s.name);

      switch (s.type) {
        case SeriesType.VOLUME:
          if (s.pane === mainChartPane) {
            s.options = {
              ...s.options,
              priceScaleId: '',
              lastValueVisible: false,
            };
          }
          break;
        default:
          break;
      }

      const seriesApi = this.#addSeries(seriesType, s.options, s.pane, isCustomSeries);
      s.api = seriesApi;

      if (s.type === SeriesType.VOLUME) {
        seriesApi?.priceScale().applyOptions({
          scaleMargins: {
            top: s.pane === mainChartPane ? 0.8 : 0.1,
            bottom: 0,
          },
        });
      }
    });
  }

  #addSeries(seriesType: any, options: any, pane: number, isCustom: boolean) {
    if (isCustom) {
      return this.#chartApi?.addCustomSeries(new (seriesType as any)(), options, pane);
    }
    return this.#chartApi?.addSeries(seriesType as any, options, pane);
  }

  #updateLegends() {
    requestAnimationFrame(() => {
      this.legendService.updateSeriesApi();
      this.legendService.updatePanePositions(this.chartContainer()?.nativeElement);
    });
  }

  #onRangeChangeFinished(range: LogicalRange) {
    if (!this.#previousRange) {
      this.#previousRange = range;
      return;
    }

    if (range.from === this.#previousRange.from && range.to === this.#previousRange.to) return;

    this.#previousRange = range;

    const candleData = this.appStore.series
      .series$()
      .series.find((s) => s.type === SeriesType.CANDLE || s.type === SeriesType.HeikinAshi);
    const firstCandleTime = candleData?.api?.data()[0].time;
    const lastCandleTime = candleData?.api?.data()[candleData?.api?.data().length - 1].time;
    const chartRange = this.appStore.chart.range$();

    if (chartRange?.start !== firstCandleTime && range.from < PREFETCH_THRESHOLD) {
      this.#getChartData();
    }
    if (chartRange?.end !== lastCandleTime && range.to > this.totalCandles() - PREFETCH_THRESHOLD) {
      this.#getChartData(true);
    }
  }

  #onSymbolChanged() {
    effect(() => {
      this.appStore.settings.symbol$();

      untracked(() => {
        if (!this.#chartApi) return;
        this.#resetChart(true);
      });
    });
  }

  #onTimeframeChanged() {
    effect(() => {
      this.appStore.settings.timeframe$();

      untracked(() => {
        if (!this.#chartApi) return;
        this.#resetChart(true);
      });
    });
  }

  #onChartTypeChanged() {
    effect(() => {
      this.appStore.settings.chartType$();

      untracked(() => {
        if (!this.#chartApi) return;
        this.#resetChart();
      });
    });
  }

  #resetChart(shouldGetRangeData: boolean = false) {
    this.#shouldChartDataReset = true;
    this.#oldestDateTime = null;
    this.#newestDateTime = null;
    if (shouldGetRangeData) this.#getRangeData();
    else this.#getChartData();
  }

  //#endregion
}
