import { Injectable } from '@angular/core';
import { BaseService } from '@core/services/base-service';
import { END_POINTS } from '@core/constants/end-points';
import { ChartDataRequest } from '@models/requests/chart-data.request';
import { Observable } from 'rxjs';
import { ApiResponse } from '@core/models/api-response';
import { ChartDataResponse } from '@models/responses';

@Injectable({
  providedIn: 'root',
})
export class ChartRepository {
  constructor(private baseService: BaseService) {}

  getChartData(req: ChartDataRequest): Observable<ApiResponse<ChartDataResponse>> {
    return this.baseService.post(END_POINTS.CHARTS.GET.CHARTS, req);
  }

  getRangeData(req: ChartDataRequest): Observable<ApiResponse<ChartDataResponse>> {
    return this.baseService.post(END_POINTS.CHARTS.GET.CHARTS, req);
  }
}
