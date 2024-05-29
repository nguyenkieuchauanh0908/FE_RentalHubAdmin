import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, tap } from 'rxjs';
import { handleError } from 'src/app/shared/handle-errors';
import { resDataDTO } from 'src/app/shared/resDataDTO';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  constructor(private http: HttpClient) {}

  // Status 0: Chờ duyệt, 1: Đã duyệt, 2: Từ chối duyệt, 3: Khóa lại
  getAddressesRequests(status: number, page: number, limit: number) {
    let queryParams = new HttpParams()
      .append('status', status)
      .append('page', page)
      .append('limit', limit);
    return this.http
      .get<resDataDTO>(environment.baseUrl + 'admin/get-register-address', {
        params: queryParams,
      })
      .pipe(catchError(handleError));
  }

  getAddressRequestDetailById(addressId: string, notiId: string | null) {
    let queryParams = new HttpParams().append('addressId', addressId);
    if (notiId) {
      queryParams.append('notiId', notiId);
    }

    return this.http
      .get<resDataDTO>(
        environment.baseUrl + 'admin/get-register-address-by-id',
        {
          params: queryParams,
        }
      )
      .pipe(catchError(handleError));
  }

  sensorAddressRequest(addressId: string, status: number, reason: string) {
    // console.log('🚀 ~ AddressService ~ sensorAddressRequest ~ reason:', reason);

    return this.http
      .patch<resDataDTO>(
        environment.baseUrl + 'admin/sensor-register-address',
        {
          id: addressId,
          status: status,
          reason: reason,
        }
      )
      .pipe(catchError(handleError));
  }

  searchAddressesById(
    addressId: string,
    active: boolean,
    page: number,
    limit: number
  ) {
    let queryParams = new HttpParams()
      .append('keyword', addressId)
      .append('active', active)
      .append('page', page)
      .append('limit', limit);
    return this.http
      .get<resDataDTO>(environment.baseUrl + 'admin/search-address', {
        params: queryParams,
      })
      .pipe(catchError(handleError));
  }
}
