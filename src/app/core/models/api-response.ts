import { HttpStatusCode } from '@angular/common/http';

export interface ApiResponse<T> {
  statusCode: HttpStatusCode;
  message: string;
  data?: T;
}
