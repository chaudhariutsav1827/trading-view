import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response';
import { KeyValue } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class BaseService {
  #header: { [key: string]: string } = {
    'Content-Type': 'application/json',
  };

  constructor(private http: HttpClient) {}

  get<T>(url: string, query?: KeyValue<string, string | number>[]): Observable<ApiResponse<T>> {
    const queryString = this.generateQueryString(query);
    return this.http.get<ApiResponse<T>>(url + queryString, {
      headers: this.#header,
    });
  }

  post<T>(url: string, body: any): Observable<ApiResponse<T>> {
    return this.http.post<ApiResponse<T>>(url, body, { headers: this.#header });
  }

  put<T>(url: string, body: any): Observable<ApiResponse<T>> {
    return this.http.put<ApiResponse<T>>(url, body, { headers: this.#header });
  }

  delete<T>(url: string): Observable<ApiResponse<T>> {
    return this.http.delete<ApiResponse<T>>(url, { headers: this.#header });
  }

  generateQueryString = (queryStringObj?: KeyValue<string, string | number>[]): string => {
    if (!queryStringObj || Object.entries(queryStringObj).length === 0) {
      return '';
    }
    const params = new URLSearchParams();
    for (const param of queryStringObj) {
      params.append(param.key, String(param.value));
    }

    return `?${params.toString()}`;
  };
}
