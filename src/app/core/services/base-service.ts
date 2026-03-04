import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response';

@Injectable({
  providedIn: 'root',
})
export class BaseService {
  #header: { [key: string]: string } = {
    'Content-Type': 'application/json',
  };

  constructor(private http: HttpClient) {}

  get<T>(url: string): Observable<ApiResponse<T>> {
    return this.http.get<ApiResponse<T>>(url, { headers: this.#header });
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
}
