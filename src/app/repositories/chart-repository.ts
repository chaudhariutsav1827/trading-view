import { Injectable } from '@angular/core';
import { BaseService } from '@core/services/base-service';
import { END_POINTS } from '@core/constants/end-points';
import { Observable } from 'rxjs';
import { ApiResponse } from '@core/models/api-response';
import { ChartDataResponse, ChartRangeResponse } from '@models/responses';
import { ChartRangeRequest, ChartDataRequest } from '@models/requests';

@Injectable({
  providedIn: 'root',
})
export class ChartRepository {
  constructor(private baseService: BaseService) {}

  getRangeData(model: ChartRangeRequest): Observable<ApiResponse<ChartRangeResponse>> {
    return this.baseService.post(END_POINTS.CHARTS.GET.DATE_RANGE, model);
  }

  getChartData(req: ChartDataRequest): Observable<ApiResponse<ChartDataResponse>> {
    return this.baseService.post(END_POINTS.CHARTS.GET.CHARTS, req);
  }
}
