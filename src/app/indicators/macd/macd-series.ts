import {
  CustomSeriesPricePlotValues,
  ICustomSeriesPaneView,
  PaneRendererCustomData,
  WhitespaceData,
  Time,
} from 'lightweight-charts';
import { MACDData } from './data';
import { defaultOptions, MACDSeriesOptions } from './options';
import { MACDSeriesRenderer } from './renderer';

export class MACDSeries<TData extends MACDData> implements ICustomSeriesPaneView<
  Time,
  TData,
  MACDSeriesOptions
> {
  private _renderer: MACDSeriesRenderer<TData>;

  constructor() {
    this._renderer = new MACDSeriesRenderer();
  }

  priceValueBuilder(plotRow: TData): CustomSeriesPricePlotValues {
    return [plotRow.macd, plotRow.signal, plotRow.histogram];
  }

  isWhitespace(data: TData | WhitespaceData): data is WhitespaceData {
    return (
      (data as Partial<TData>).macd === undefined ||
      (data as Partial<TData>).signal === undefined ||
      (data as Partial<TData>).histogram === undefined
    );
  }

  renderer(): MACDSeriesRenderer<TData> {
    return this._renderer;
  }

  update(data: PaneRendererCustomData<Time, TData>, options: MACDSeriesOptions): void {
    this._renderer.update(data, options);
  }

  defaultOptions(): MACDSeriesOptions {
    return defaultOptions;
  }
}
