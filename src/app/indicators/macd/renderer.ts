import { BitmapCoordinatesRenderingScope, CanvasRenderingTarget2D } from 'fancy-canvas';
import {
  ICustomSeriesPaneRenderer,
  PaneRendererCustomData,
  PriceToCoordinateConverter,
  Time,
} from 'lightweight-charts';
import { MACDData } from './data';
import { MACDSeriesOptions } from './options';

interface MACDBarItem {
  x: number;
  macd: number;
  signal: number;
  histogram: number;
  isUp: boolean;
}

export class MACDSeriesRenderer<TData extends MACDData> implements ICustomSeriesPaneRenderer {
  _data: PaneRendererCustomData<Time, TData> | null = null;
  _options: MACDSeriesOptions | null = null;

  draw(target: CanvasRenderingTarget2D, priceConverter: PriceToCoordinateConverter): void {
    target.useBitmapCoordinateSpace((scope) => this._drawImpl(scope, priceConverter));
  }

  update(data: PaneRendererCustomData<Time, TData>, options: MACDSeriesOptions): void {
    this._data = data;
    this._options = options;
  }

  _drawImpl(
    renderingScope: BitmapCoordinatesRenderingScope,
    priceToCoordinate: PriceToCoordinateConverter,
  ): void {
    if (
      this._data === null ||
      this._data.bars.length === 0 ||
      this._data.visibleRange === null ||
      this._options === null
    ) {
      return;
    }

    const ctx = renderingScope.context;
    const horizontalPixelRatio = renderingScope.horizontalPixelRatio;
    const verticalPixelRatio = renderingScope.verticalPixelRatio;

    // ✅ Only process bars within the visible range to prevent stray lines
    const { from, to } = this._data.visibleRange;
    const allBars: MACDBarItem[] = this._data.bars.map((bar) => {
      const d = bar.originalData as TData;
      return {
        x: bar.x,
        macd: d.macd,
        signal: d.signal,
        histogram: d.histogram,
        isUp: d.histogram >= 0,
      };
    });

    // Slice to visible range only
    const bars = allBars.slice(from, to);

    if (bars.length === 0) return;

    const zeroY = priceToCoordinate(0);
    if (zeroY === null) return;

    const zeroYPixel = Math.round(zeroY * verticalPixelRatio);

    // --- Draw Histogram Bars ---
    const barWidth = Math.max(2, Math.floor((this._data.barSpacing - 2) * horizontalPixelRatio));

    for (const bar of bars) {
      const histY = priceToCoordinate(bar.histogram);
      if (histY === null) continue;

      const xPixel = Math.round(bar.x * horizontalPixelRatio);
      const histYPixel = Math.round(histY * verticalPixelRatio);

      const barTop = Math.min(histYPixel, zeroYPixel);
      const barBottom = Math.max(histYPixel, zeroYPixel);
      const barHeight = Math.max(1, barBottom - barTop);

      ctx.fillStyle = bar.isUp ? this._options.histogramUpColor : this._options.histogramDownColor;
      ctx.fillRect(xPixel - Math.floor(barWidth / 2), barTop, barWidth, barHeight);
    }

    // --- Draw MACD Line ---
    this._drawLine(
      ctx,
      bars,
      'macd',
      this._options.macdLineColor,
      2 * horizontalPixelRatio,
      priceToCoordinate,
      verticalPixelRatio,
      horizontalPixelRatio,
    );

    // --- Draw Signal Line ---
    this._drawLine(
      ctx,
      bars,
      'signal',
      this._options.signalLineColor,
      1.5 * horizontalPixelRatio,
      priceToCoordinate,
      verticalPixelRatio,
      horizontalPixelRatio,
    );

    // --- Draw Zero Line ---
    ctx.save();
    ctx.strokeStyle = 'rgba(150, 150, 150, 0.4)';
    ctx.lineWidth = 1 * verticalPixelRatio;
    ctx.setLineDash([4 * horizontalPixelRatio, 4 * horizontalPixelRatio]);
    ctx.beginPath();
    const firstX = Math.round(bars[0].x * horizontalPixelRatio);
    const lastX = Math.round(bars[bars.length - 1].x * horizontalPixelRatio);
    ctx.moveTo(firstX, zeroYPixel);
    ctx.lineTo(lastX, zeroYPixel);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  }

  private _drawLine(
    ctx: CanvasRenderingContext2D,
    bars: MACDBarItem[],
    field: 'macd' | 'signal',
    color: string,
    lineWidth: number,
    priceConverter: PriceToCoordinateConverter,
    verticalPixelRatio: number,
    horizontalPixelRatio: number,
  ): void {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.beginPath();

    let started = false;
    for (const bar of bars) {
      const y = priceConverter(bar[field]);
      if (y === null) continue;
      const xPixel = Math.round(bar.x * horizontalPixelRatio);
      const yPixel = Math.round(y * verticalPixelRatio);
      if (!started) {
        ctx.moveTo(xPixel, yPixel);
        started = true;
      } else {
        ctx.lineTo(xPixel, yPixel);
      }
    }

    ctx.stroke();
    ctx.restore();
  }
}
