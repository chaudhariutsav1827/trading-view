import { inject, Injectable } from '@angular/core';
import { HelperService } from '@core/services/helper-service';
import { CandleModel } from '@models/dto';
import { FormattedChartData } from '@models/dto/formated-chart-data-model';
import {
  FormattedMacdData,
  FormattedVolumeData,
  MacdModel,
  VolumeModel,
} from '@models/dto/indicator-models';
import { ChartDataResponse } from '@models/responses';

@Injectable({
  providedIn: 'root',
})
export class ChartService {
  helperService = inject(HelperService);

  formatChartData(data: ChartDataResponse): FormattedChartData {
    const candles = this.#formateCandleData(data?.candles);

    if (!data.indicators) return { candles };

    const volume = data?.indicators?.volume
      ? this.#formateVolumeData(data?.indicators?.volume)
      : undefined;

    const macd = data?.indicators?.macd ? this.#formateMacdData(data?.indicators?.macd) : undefined;

    return {
      candles,
      volume,
      macd,
    };
  }

  #formateCandleData(data: CandleModel[]) {
    return data?.map((item) => ({
      time: this.helperService.timeToTz(item.date),
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.close,
    }));
  }

  #formateVolumeData(data: VolumeModel[]): FormattedVolumeData[] {
    return data?.map((v) => ({
      time: this.helperService.timeToTz(v.date),
      value: v.volume,
      color: v.isPositive ? '#00d4aa' : '#ff4757',
    }));
  }

  #formateMacdData(data: MacdModel[]): FormattedMacdData[] {
    return data?.map((m) => ({
      time: this.helperService.timeToTz(m.date),
      macd: m.macd,
      signal: m.signal,
      histogram: m.histogram,
    }));
  }
}
