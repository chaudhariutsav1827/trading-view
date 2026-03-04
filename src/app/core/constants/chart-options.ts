import { CrosshairMode, DeepPartial, TimeChartOptions } from 'lightweight-charts';

export const CHART_OPTIONS: DeepPartial<TimeChartOptions> = {
  layout: { background: { color: '#13161e' }, textColor: '#5a6070' },
  grid: {
    vertLines: { color: '#1a1d27' },
    horzLines: { color: '#1a1d27' },
  },
  crosshair: {
    mode: CrosshairMode.Normal,
    vertLine: { color: '#3a3f52', width: 1, style: 1 },
    horzLine: { color: '#3a3f52', width: 1, style: 1 },
  },
  rightPriceScale: { borderColor: '#1f2330', autoScale: true },
  timeScale: {
    borderColor: '#1f2330',
    timeVisible: true,
    secondsVisible: false,
    shiftVisibleRangeOnNewBar: false,
    allowShiftVisibleRangeOnWhitespaceReplacement: false,
    minBarSpacing: 5,
  },
  handleScroll: {
    mouseWheel: true,
    pressedMouseMove: true,
    horzTouchDrag: false,
  },
  handleScale: { mouseWheel: true, pinch: true },
};
