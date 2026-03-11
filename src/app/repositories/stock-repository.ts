import { KeyValue } from '@angular/common';
import { Injectable } from '@angular/core';
import { END_POINTS } from '@core/constants/end-points';
import { ApiResponse } from '@core/models/api-response';
import { BaseService } from '@core/services/base-service';
import { StockResponse } from '@models/responses';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StockRepository {
  constructor(private baseService: BaseService) {}

  getStocks(query: KeyValue<string, string | number>[]): Observable<ApiResponse<StockResponse[]>> {
    return this.baseService.get(END_POINTS.STOCKS.GET.SEARCH, query);
  }
}
